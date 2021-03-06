/**
 * The Search widget provides a way to perform search operations on {@link module:esri/tasks/Locator locator service(s)}
 * and/or {@link module:esri/layers/MapImageLayer map}/{@link module:esri/layers/FeatureLayer feature}
 * service feature layer(s).
 * If using a locator with a geocoding service, the
 * [findAddressCandidates](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm)
 * operation is used, whereas {@link module:esri/tasks/support/Query queries} are used on feature layers.
 *
 * ![search](../assets/img/apiref/widgets/search.png)
 *
 * You can use the view's {@link module:esri/views/ui/DefaultUI} to add widgets
 * to the view's user interface via the {@link module:esri/views/View#ui ui} property on the view.
 * See the example below.
 *
 * @example
 * var searchWidget = new Search({
 *   view: view
 * });
 * // Adds the search widget below other elements in
 * // the top left corner of the view
 * view.ui.add(searchWidget, {
 *   position: "top-left",
 *   index: 2
 * });
 *
 * @module esri/widgets/Search
 * @since 4.0
 *
 * @see [Search.tsx (widget view)]({{ JSAPI_BOWER_URL }}/widgets/Search.tsx)
 * @see [Search.scss]({{ JSAPI_BOWER_URL }}/themes/base/widgets/_Search.scss)
 * @see [Sample - Search widget (3D)](../sample-code/widgets-search-3d/index.html)
 * @see [Sample - Search widget with multiple sources](../sample-code/widgets-search-multiplesource/index.html)
 * @see module:esri/tasks/Locator
 * @see module:esri/layers/FeatureLayer
 * @see module:esri/widgets/Search/SearchViewModel
 * @see {@link module:esri/views/View#ui View.ui}
 * @see module:esri/views/ui/DefaultUI
 */

/// <amd-dependency path="../core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="../core/tsSupport/decorateHelper" name="__decorate" />

import { aliasOf, subclass, declared, property } from "../core/accessorSupport/decorators";

import { ActiveMenu, SearchItem, SearchResponse, SearchResult, SearchResults, SuggestResult } from "./interfaces";

import {
  accessibleHandler,
  renderable,
  tsx,
  join,
  vmEvent
} from "./support/widget";

import FeatureLayerSearchSource = require("./Search/FeatureLayerSearchSource");
import LocatorSearchSource = require("./Search/LocatorSearchSource");
import SearchViewModel = require("./Search/SearchViewModel");
import SearchResultRenderer = require("./Search/SearchResultRenderer");

import Widget = require("./Widget");

import Collection = require("../core/Collection");
import esriLang = require("../core/lang");
import watchUtils = require("../core/watchUtils");

import Graphic = require("../Graphic");

import Point = require("../geometry/Point");

import PopupTemplate = require("../PopupTemplate");

import MapView = require("../views/MapView");
import SceneView = require("../views/SceneView");

import regexp = require("dojo/regexp");

import geolocationUtils = require("../core/geolocationUtils");

import {
  copyKey,
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  END,
  ENTER,
  ESCAPE,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SHIFT,
  TAB,
  UP_ARROW
} from "dojo/keys";

import query = require("dojo/query");

import * as i18n from "dojo/i18n!./Search/nls/Search";

type State = "disabled" | "ready" | "searching";

const CSS = {
  base: "esri-search esri-widget",
  hasMultipleSources: "esri-search--multiple-sources",
  isSearchLoading: "esri-search--loading",
  showSuggestions: "esri-search--show-suggestions",
  showSources: "esri-search--sources",
  showWarning: "esri-search--warning",
  container: "esri-search__container",
  input: "esri-search__input",
  inputContainer: "esri-search__input-container",
  form: "esri-search__form",
  submitButton: "esri-search__submit-button",
  sourcesButton: "esri-search__sources-button",
  clearButton: "esri-search__clear-button",
  sourceName: "esri-search__source-name",
  suggestionsMenu: "esri-search__suggestions-menu",
  sourcesMenu: "esri-search__sources-menu",
  source: "esri-search__source",
  activeSource: "esri-search__source--active",
  warningMenu: "esri-search__warning-menu",
  warningMenuBody: "esri-search__warning-body",
  warningMenuHeader: "esri-search__warning-header",
  warningMenuText: "esri-search__warning-text",
  noValueText: "esri-search__no-value-text",

  // icons + common
  button: "esri-widget-button",
  fallbackText: "esri-icon-font-fallback-text",
  locate: "esri-icon-locate-circled",
  menu: "esri-menu",
  header: "esri-header",
  searchIcon: "esri-icon-search",
  dropdownIcon: "esri-icon-down-arrow esri-search__sources-button--down",
  dropupIcon: "esri-icon-up-arrow esri-search__sources-button--up",
  clearIcon: "esri-icon-close",
  noticeIcon: "esri-icon-notice-triangle",

  // common
  disabled: "esri-disabled"
};

@subclass("esri.widgets.Search")
class Search extends declared(Widget) {

  /**
   * The following properties define a [source](#sources) pointing to a
   * {@link module:esri/tasks/Locator} that may be used to geocode locations
   * with the Search widget.
   *
   * @typedef LocatorSource
   *
   * @property {boolean} [autoNavigate=true] - Indicates whether to automatically navigate to the
   *   selected result once selected.
   * @property {string[]} categories - A string array which limits the results to one
   *   or more categories. For example "Populated Place" or
   *   "airport". Only applicable when using the
   *   World Geocode Service. View the
   * [World Geocoding Service documentation](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm) for more information.
   * @property {string} countryCode - Constricts search results to a specified country code.
   *   For example, `US` for United States or `SE` for Sweden.
   *   Only applies to the World Geocode Service. View the
   * [World Geocoding Service documentation](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm) for more information.
   * @property {Object} filter - As of version 4.4, this property replaces the now deprecated `searchQueryParams`, `suggestQueryParams`, and `searchExtent`
   * properties. Please see the object specification table below for details.
   * @property {string} filter.where - The where clause specified for filtering suggests or search results.
   * @property {module:esri/geometry/Geometry} filter.geometry - The filter geometry for suggests or search results.
   * @property {Object} localSearchOptions - Sets the sources for local `distance` and
   *   `minScale` for searching. See the object specification table below for details.
   * @property {number} localSearchOptions.distance - The distance to search.
   * @property {number} localSearchOptions.minScale - The minimum scale used to search locally.
   * @property {number} [locationToAddressDistance=1500] - When reverse geocoding a result, use
   *   this distance in meters.
   * @property {module:esri/tasks/Locator} locator - The locator task used to search. This
   *   is **required** and defaults to the
   * [World Geocoding Service](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm).
   * @property {number} [maxResults=6] - Indicates the maximum number of search results
   *   to return.
   * @property {number} [maxSuggestions=6] - Indicates the maximum number of suggestions
   *   to return for the widget's input.
   * @property {number} [minSuggestCharacters=1] - Indicates the minimum number of characters
   *   required before querying for a suggestion.
   * @property {string} name - The name of the source for display.
   * @property {string[]} outFields - Specifies the fields returned with the search results.
   * @property {string} placeholder - Used as a hint for the source input text.
   * @property {module:esri/widgets/Popup} popup - The Popup instance used for the selected result.
   * @property {boolean} [popupEnabled=true] - Indicates whether to display a
   *   {@link module:esri/widgets/Popup Popup} when a selected result is clicked.
   * @property {boolean} [popupOpenOnSelect=true] - Indicates whether to show the
   *   {@link module:esri/widgets/Popup Popup} when a result is selected.
   * @property {string} prefix - Specify this to prefix the input for the search text.
   * @property {boolean} [resultGraphicEnabled=true] - Indicates whether to show a graphic on the
   *   map for the selected source using the [resultSymbol](#resultSymbol).
   * @property {module:esri/symbols/Symbol} [resultSymbol] - The symbol used for the
   *   [resultGraphic](#resultGraphic).
   * @property {string} [searchTemplate] - A template string used to display multiple
   *   fields in a defined order when results are displayed,
   *   e.g. `"{Street}, {City}, {ZIP}"`.
   * @property {string} singleLineFieldName - The field name of the Single Line Address
   *   Field in the REST services directory for the locator service.
   *   Common values are `SingleLine` and `SingleLineFieldName`.
   * @property {boolean} [suggestionsEnabled=true] - Indicates whether to display suggestions
   *   as the user enters input text in the widget.
   * @property {string} [suffix] - Specify this to suffix the input for the search value.
   * @property {boolean} [withinViewEnabled] - Indicates whether to constrain the search
   *   results to the view's extent.
   * @property {number} [zoomScale] - The set zoom scale for the resulting search result. This scale is automatically honored.
   */

  /**
   * The following properties define a
   * {@link module:esri/layers/FeatureLayer}-based [source](#sources) whose
   * features may be searched by the Search widget.
   *
   * @typedef FeatureLayerSource
   *
   * @property {boolean} [autoNavigate=true] - Indicates whether to automatically navigate to the
   *   selected result once selected.
   * @property {string} displayField - The results are displayed using this field. Defaults
   *   to the layer's `displayField` or the first string field.
   * @property {boolean} [exactMatch=false] - Indicates to only return results that match the
   *   search value exactly.
   *   This property only applies to `string` field searches. `exactMatch` is always
   *   `true` when searching fields of type `number`.
   * @property {module:esri/layers/FeatureLayer} featureLayer - The feature layer queried
   *   in the search. This is **required**.
   * @property {Object} filter - As of version 4.4, this property replaces the now deprecated `searchQueryParams`, `suggestQueryParams`, and `searchExtent`
   * properties. Please see the object specification table below for details.
   * @property {string} filter.where - The where clause specified for filtering suggests or search results.
   * @property {module:esri/geometry/Geometry} filter.geometry - The filter geometry for suggests or search results.
   * @property {number} [maxResults=6] - Indicates the maximum number of search results to
   *   return.
   * @property {number} [maxSuggestions=6] - Indicates the maximum number of suggestions to
   *   return for the widget's input.
   * @property {number} [minSuggestCharacters=1] - Indicates the minimum number of characters
   *   required before querying for a suggestion.
   * @property {string} name - The name of the source for display.
   * @property {string[]} outFields - Specifies the fields returned with the search results.
   * @property {string} placeholder - Used as a hint for the source input text.
   * @property {module:esri/widgets/Popup} popup - The Popup instance used for the selected result.
   * @property {boolean} [popupEnabled=true] - Indicates whether to display a
   *   {@link module:esri/widgets/Popup} when a selected result is clicked.
   * @property {boolean} [popupOpenOnSelect=true] - Indicates whether to show the
   *   {@link module:esri/widgets/Popup Popup} when a result is selected.
   * @property {string} prefix - Specify this to prefix the input for the search text.
   * @property {boolean} [resultGraphicEnabled=true] - Indicates whether to show a graphic on the
   *   map for the selected source using the [resultSymbol](#resultSymbol).
   * @property {module:esri/symbols/Symbol} resultSymbol - The symbol used for the
   *   [resultGraphic](#resultGraphic).
   * @property {string[]} searchFields - An array of string values representing the
   *   names of fields in the feature layer to search.
   * @property {string} suffix - Specify this to suffix the input for the search value.
   * @property {boolean} [suggestionsEnabled=true] - Indicates whether to display suggestions
   *   as the user enters input text in the widget.
   * @property {string} suggestionTemplate - A template string used to display multiple
   *   fields in a defined order
   *   when suggestions are displayed. This takes precedence over `displayField`.
   *   Field names in the template must have the following
   *   format: `{FieldName}`. An example suggestionTemplate could look something
   *   like: `Name: {OWNER}, Parcel: {PARCEL_ID}`.
   * @property {boolean} withinViewEnabled - Indicates whether to constrain the search
   *   results to the view's extent.
   * @property {number} zoomScale - The set zoom scale for the resulting search result. This scale is automatically honored.
   */

  /**
   * The result object returned from a [search()](#search).
   *
   * @typedef SearchResult
   *
   * @property {module:esri/geometry/Extent} extent - The extent, or bounding box, of the returned feature.
   * @property {module:esri/Graphic} feature - The resulting feature or location obtained from the search.
   * @property {string} name - The name of the result.
   */

  /**
   * The result object returned from a [suggest()](#suggest).
   *
   * @typedef SuggestResult
   *
   * @property {string} key - The key related to the suggest result.
   * @property {string} text - The string name of the suggested location to geocode.
   * @property {number} sourceIndex - The index of the currently selected result.
   */

  /**
   * When resolved, returns this response after calling [search](#search).
   *
   * @typedef SearchResponse
   *
   * @property {number} activeSourceIndex - The index of the source from which the search result was obtained.
   * @property {Error[]} errors - An array of error objects returned from the search results.
   * @property {number} numResults - The number of search results.
   * @property {string} searchTerm - The searched expression
   * @property {Object[]} results - An array of objects representing the results of search. See object specification
   * table below for more information about the result object.
   * @property {module:esri/widgets/Search~SearchResult[]} results.results - An array of search results.
   * @property {number} results.sourceIndex - The index of the currently selected source.
   * @property {Object} results.source - The [source](#sources) of the selected result.
   */

  /**
   * When resolved, returns this response after calling [suggest](#suggest).
   *
   * @typedef SuggestResponse
   *
   * @property {number} activeSourceIndex - The index of the source from which suggestions are obtained. This value is `-1` when all sources are selected.
   * @property {Error[]} errors - An array of error objects returned from the suggest results.
   * @property {number} numResults - The number of suggest results.
   * @property {string} searchTerm - The search expression used for the suggest.
   * @property {Object[]} results - An array of objects representing the results of suggest. See object specification
   * table below for more information about the result object.
   * @property {module:esri/widgets/Search~SuggestResult[]} results.results - An array of suggest results.
   * @property {number} results.sourceIndex - The index of the currently selected source.
   * @property {Object} results.source - The [source](#sources) of the selected result.
   */

  /**
   * Fires when the widget's text input loses focus.
   *
   * @event module:esri/widgets/Search#search-blur
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("search-blur", function(event){
   *   console.log("Focus removed from search input textbox.");
   * });
   */

  /**
   * Fires when the widget's text input sets focus.
   *
   * @event module:esri/widgets/Search#search-focus
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("search-focus", function(event){
   *   console.log("Search input textbox is focused.");
   * });
   */

  /**
   * Fires when a result is cleared from the input box or a new result is selected.
   *
   * @event module:esri/widgets/Search#search-clear
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("search-clear", function(event){
   *   console.log("Search input textbox was cleared.");
   * });
   */

  /**
   * Fires when the [search()](#search) method starts.
   *
   * @event module:esri/widgets/Search#search-start
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("search-start", function(event){
   *   console.log("Search started.");
   * });
   */

  /**
   * Fires when the [suggest()](#suggest) method starts.
   *
   * @event module:esri/widgets/Search#suggest-start
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("suggest-start", function(event){
   *   console.log("suggest-start", event);
   * });
   */

  /**
   * Fires when the [search()](#search) method is called and returns its results.
   *
   * @event module:esri/widgets/Search#search-complete
   * @property {number} activeSourceIndex - The index of the source from which the search result was obtained.
   * @property {Error[]} errors - An array of error objects returned from the search results.
   * @property {number} numResults - The number of results from the search.
   * @property {string} searchTerm - The searched expression.
   * @property {Object[]} results - An array of objects representing the results of the search. See object specification
   * table below for more information about the result object.
   * @property {module:esri/widgets/Search~SearchResult[]} results.results - An array of objects containing the search results.
   * @property {number} results.sourceIndex - The index of the currently selected source.
   * @property {Object} results.source - The [source](#sources) of the selected result.
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("search-complete", function(event){
   *   // The results are stored in the event Object[]
   *   console.log("Results of the search: ", event);
   * });
   */

  /**
   * Fires when a search result is selected.
   *
   * @event module:esri/widgets/Search#select-result
   * @property {Object} result - An object containing the results of the search.
   * @property {module:esri/geometry/Extent} result.extent - The extent of the result to zoom to.
   * @property {module:esri/Graphic} result.feature - The graphic feature to place at the location of the search result.
   * @property {string} result.name - The string name of the geocoded location.
   * @property {Object} source - The source of the selected result. Please see [sources](#sources) for
   * additional information on its properties.
   * @property {number} sourceIndex - The index of the source of the selected result.
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("select-result", function(event){
   *   console.log("The selected search result: ", event);
   * });
   */

  /**
   * Fires when the [suggest](#suggest) method is called and returns its results.
   *
   * @event module:esri/widgets/Search#suggest-complete
   * @property {number} activeSourceIndex - The index of the source from which suggestions are obtained. This value is `-1` when all sources are selected.
   * @property {Error[]} errors - An array of error objects returned from the suggest results.
   * @property {number} numResults - The number of suggest results.
   * @property {string} searchTerm - The search expression used for the suggest.
   * @property {Object[]} results - An array of objects representing the results of suggest. See object specification table below for more information on this object.
   * @property {module:esri/widgets/Search~SuggestResult[]} results.results - An array of objects containing the suggest results.
   * @property {number} results.sourceIndex - The index of the currently selected source.
   * @property {Object} results.source - The [source](#sources) of the selected result.
   *
   * @example
   * var searchWidget = new Search();
   *
   * searchWidget.on("suggest-complete", function(event){
   *   // The results are stored in the event Object[]
   *   console.log("Results of suggest: ", event);
   * });
   */

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  /**
   * @constructor
   * @alias module:esri/widgets/Search
   * @extends module:esri/widgets/Widget
   * @param {Object} [properties] - See the [properties](#properties-summary) for a list of all the properties
   *                              that may be passed into the constructor.
   *
   * @example
   * // typical usage
   * var search = new Search({
   *   view: view,
   *   sources: [ ... ]
   * });
   */
  constructor(value?: any) {
    super();

    this._supportsGeolocation = geolocationUtils.supported();
  }

  postInitialize() {
    this.viewModel.popupTemplate = this._popupTemplate;

    this.own(
      watchUtils.watch(this, "searchTerm", value => {
        const hideActiveMenu = (value && this.activeMenu === "warning") ||
          (!value && !this.get("viewModel.selectedSuggestion.location"));

        if (hideActiveMenu) {
          this.activeMenu = "none";
        }
      })
    );
  }

  destroy() {
    this._cancelSuggest();

    if (this._searchResultRenderer) {
      this._searchResultRenderer.viewModel = null;
      this._searchResultRenderer.destroy();
      this._searchResultRenderer = null;
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _supportsGeolocation: boolean = null;

  private _inputNode: HTMLInputElement = null;

  private _searching: IPromise<SearchResponse<SearchResults<SearchResult>> | Point> = null;

  private _sourceMenuButtonNode: HTMLDivElement = null;

  private _sourceListNode: HTMLUListElement = null;

  private _suggestionListNode: HTMLDivElement = null;

  private _searchResultRenderer = new SearchResultRenderer({
    container: document.createElement("div")
  });

  private _suggestPromise: IPromise<SearchResults<SuggestResult>[]> = null;

  private _popupTemplate: PopupTemplate = new PopupTemplate({
    title: i18n.searchResult,
    content: this._renderSearchResultsContent.bind(this)
  });

  private _relatedTarget: HTMLElement = null;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  activeMenu
  //----------------------------------

  /**
   * @todo document
   * @ignore
   */
  @property()
  @renderable()
  activeMenu: ActiveMenu = "none";

  //----------------------------------
  //  activeSource
  //----------------------------------

  /**
   * The [source](#sources) object currently selected. Can be either a
   * {@link module:esri/layers/FeatureLayer feature layer} or a {@link module:esri/tasks/Locator locator task}.
   *
   * @name activeSource
   * @instance
   * @type {module:esri/layers/FeatureLayer | module:esri/tasks/Locator}
   * @readonly
   */
  @aliasOf("viewModel.activeSource")
  @renderable()
  activeSource: LocatorSearchSource | FeatureLayerSearchSource = null;

  //----------------------------------
  //  activeSourceIndex
  //----------------------------------

  /**
   * The selected source's index. This value is `-1` when all sources are selected.
   *
   * @name activeSourceIndex
   * @instance
   * @type {number}
   * @default 0
   */
  @aliasOf("viewModel.activeSourceIndex")
  @renderable()
  activeSourceIndex: number = null;

  //----------------------------------
  //  allPlaceholder
  //----------------------------------

  /**
   * String value used as a hint for input text when searching on multiple sources. See
   * the image below to view the location and style of this text in the context of the widget.
   *
   * ![search-allPlaceholder](../assets/img/apiref/widgets/search-allplaceholder.png)
   *
   * @name allPlaceholder
   * @instance
   * @type {string}
   * @default "Find address or place"
   */
  @aliasOf("viewModel.allPlaceholder")
  @renderable()
  allPlaceholder: string = null;

  //----------------------------------
  //  autoNavigate
  //----------------------------------

  /**
   * Indicates whether to automatically navigate to the selected result.
   *
   * @type {boolean}
   * @ignore
   */
  @aliasOf("viewModel.autoNavigate")
  autoNavigate: boolean = null;

  //----------------------------------
  //  autoSelect
  //----------------------------------

  /**
   * Indicates whether to automatically select and zoom to the first geocoded result. If `false`, the
   * [findAddressCandidates](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm)
   * operation will still geocode the input string, but the top result will not be selected. To work with the
   * geocoded results, you can set up a [search-complete](#event:search-complete) event handler and get the results
   * through the event object.
   *
   * @name autoSelect
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.autoSelect")
  autoSelect: boolean = null;

  //----------------------------------
  //  defaultSource
  //----------------------------------

  /**
   * The default source used for the Search widget. These can range from
   * a [Locator Source](#LocatorSource) to a
   * [Feature Layer](#FeatureLayerSource).
   *
   * @name defaultSource
   * @instance
   * @type {module:esri/widgets/Search~LocatorSource |
   *        module:esri/widgets/Search~FeatureLayerSource}
   * @readonly
   */
  @aliasOf("viewModel.defaultSource")
  defaultSource: LocatorSearchSource | FeatureLayerSearchSource = null;

  //----------------------------------
  //  locationEnabled
  //----------------------------------

  /**
   * Enables location services within the widget.
   *
   * ![locationEnabled](../assets/img/apiref/widgets/search-locationEnabled.png)
   *
   * ::: esri-md class="panel trailer-1"
   * The use of this property is only supported on secure origins.
   * To use it, switch your application to a secure origin, such as HTTPS.
   * Note that localhost is considered "potentially secure" and can be used for easy testing in browsers that supports
   * [Window.isSecureContext](https://developer.mozilla.org/en-US/docs/Web/API/Window/isSecureContext#Browser_compatibility)
   * (currently Chrome and Firefox).
   * :::
   *
   * @name locationEnabled
   * @instance
   * @since 4.6
   * @type {boolean}
   * @default true
   *
   */
  @property()
  locationEnabled = true;

  //----------------------------------
  //  locationToAddressDistance
  //----------------------------------

  /**
   * The default distance in meters used to reverse geocode (if not specified by source).
   *
   * @type {number}
   * @ignore
   */
  @aliasOf("viewModel.locationToAddressDistance")
  locationToAddressDistance: number = null;

  //----------------------------------
  //  maxResults
  //----------------------------------

  /**
   * The maximum number of results returned by the widget if not specified by the source.
   *
   * @name maxResults
   * @instance
   * @type {number}
   * @default 6
   */
  @aliasOf("viewModel.maxResults")
  maxResults: number = null;

  //----------------------------------
  //  maxSuggestions
  //----------------------------------

  /**
   * The maximum number of suggestions returned by the widget if not specified by the source.
   *
   * If working with the default
   * [ArcGIS Online Geocoding service](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm),
   * the default remains at `5`.
   *
   * @name maxSuggestions
   * @instance
   * @type {number}
   * @default 6
   */
  @aliasOf("viewModel.maxSuggestions")
  maxSuggestions: number = null;

  //----------------------------------
  //  minSuggestCharacters
  //----------------------------------

  /**
   * The minimum number of characters needed for the search if not specified by the source.
   *
   * @name minSuggestCharacters
   * @instance
   * @type {number}
   * @default 1
   */
  @aliasOf("viewModel.minSuggestCharacters")
  minSuggestCharacters: number = null;

  //----------------------------------
  //  popupEnabled
  //----------------------------------

  /**
   * Indicates whether to display the {@link module:esri/widgets/Popup} on feature click. The graphic can
   * be clicked to display a {@link module:esri/widgets/Popup}. This is not the same as using
   * [popupOpenOnSelect](#popupOpenOnSelect) which opens the {@link module:esri/widgets/Popup} any time a
   * search is performed.
   *
   * It is possible to have `popupOpenOnSelect=false` but `popupEnabled=true` so the
   * {@link module:esri/widgets/Popup}
   * can be opened by someone but it is not opened by default.
   *
   * @name popupEnabled
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.popupEnabled")
  popupEnabled: boolean = null;

  //----------------------------------
  //  popupOpenOnSelect
  //----------------------------------

  /**
   * Indicates whether to show the {@link module:esri/widgets/Popup} when a result is selected.
   * Using `popupOpenOnSelect` opens the {@link module:esri/widgets/Popup} any time a search is performed.
   *
   * It is possible to have `popupOpenOnSelect=false` but `popupEnabled=true` so the {@link module:esri/widgets/Popup}
   * can be opened by someone but not opened by default.
   *
   * @name popupOpenOnSelect
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.popupOpenOnSelect")
  popupOpenOnSelect: boolean = null;

  //----------------------------------
  //  popupTemplate
  //----------------------------------

  /**
   * A customized PopupTemplate for the selected feature.
   * Note that specifying a wildcard {*} for the popupTemplate will return all fields in addition to search-specific fields.
   *
   * @name popupTemplate
   * @instance
   * @type {module:esri/PopupTemplate}
   */
  @aliasOf("viewModel.popupTemplate")
  popupTemplate: PopupTemplate = null;

  //----------------------------------
  //  resultGraphic
  //----------------------------------

  /**
   * The graphic used to highlight the resulting feature or location.
   *
   * @name resultGraphic
   * @instance
   * @type {module:esri/Graphic}
   * @readonly
   */
  @aliasOf("viewModel.resultGraphic")
  resultGraphic: Graphic = null;

  //----------------------------------
  //  resultGraphicEnabled
  //----------------------------------

  /**
   * Indicates if the [resultGraphic](#resultGraphic) will display at the
   * location of the selected feature.
   *
   * @name resultGraphicEnabled
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.resultGraphicEnabled")
  resultGraphicEnabled: boolean = null;

  //----------------------------------
  //  results
  //----------------------------------

  /**
   * An array of objects, each containing a [SearchResult](#SearchResult) from the search.
   *
   * @name results
   * @instance
   * @type {Object[]}
   */
  @aliasOf("viewModel.results")
  @renderable()
  results: SearchResults<SearchResult>[] = null;

  //----------------------------------
  //  searchAllEnabled
  //----------------------------------

  /**
   * Indicates whether to display the option to search all sources. When `true`, the "All" option
   * is displayed by default:
   *
   * ![search-searchAllEnabled-true](../assets/img/apiref/widgets/search-enablesearchingall-true.png)
   *
   * When `false`, no option to search all sources at once is available:
   *
   * ![search-searchAllEnabled-false](../assets/img/apiref/widgets/search-enablesearchingall-false.png)
   *
   * @name searchAllEnabled
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.searchAllEnabled")
  @renderable()
  searchAllEnabled: boolean = null;

  //----------------------------------
  //  searchTerm
  //----------------------------------

  /**
   * The value of the search box input text string.
   *
   * @name searchTerm
   * @instance
   * @type {string}
   */
  @aliasOf("viewModel.searchTerm")
  @renderable()
  searchTerm: string = null;

  //----------------------------------
  //  selectedResult
  //----------------------------------

  /**
   * The result selected from a search.
   *
   * @name selectedResult
   * @instance
   * @type {module:esri/widgets/Search~SearchResult}
   *
   * @see [Event: select-result](#event:select-result)
   * @see [select()](#select)
   * @readonly
   */
  @aliasOf("viewModel.selectedResult")
  selectedResult: SearchResult = null;

  //----------------------------------
  //  sources
  //----------------------------------

  /**
   * The Search widget may be used to search features in a
   * {@link module:esri/layers/FeatureLayer} or geocode locations with a
   * {@link module:esri/tasks/Locator}. The `sources` property defines the sources from which
   * to search for the [view](#view) specified by the Search widget instance.
   * There are two types of sources:
   *
   * * [LocatorSource](#LocatorSource)
   * * [FeatureLayerSource](#FeatureLayerSource)
   *
   * Any combination of one or more [Locator](#LocatorSource) and
   * [FeatureLayer](#FeatureLayerSource) sources may be used
   * together in the same instance of the Search widget.
   *
   * @name sources
   * @instance
   * @type {module:esri/core/Collection<module:esri/widgets/Search~FeatureLayerSource | module:esri/widgets/Search~LocatorSource>}
   *
   * @example
   * // Default sources[] when sources is not specified
   * [
   *   {
   *     locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
   *     singleLineFieldName: "SingleLine",
   *     outFields: ["Addr_type"],
   *     name: i18n.esriLocatorName,
   *     localSearchOptions: {
   *       minScale: 300000,
   *       distance: 50000
   *     },
   *     placeholder: i18n.placeholder,
   *     resultSymbol: {
   *        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
   *        url: this.basePath + "/images/search/search-symbol-32.png",
   *        size: 24,
   *        width: 24,
   *        height: 24,
   *        xoffset: 0,
   *        yoffset: 0
   *    }
   *   }
   * ]
   *
   * @example
   * // Example of multiple sources[]
   * var sources = [
   * {
   *   locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
   *   singleLineFieldName: "SingleLine",
   *   name: "Custom Geocoding Service",
   *   localSearchOptions: {
   *     minScale: 300000,
   *     distance: 50000
   *   },
   *   placeholder: "Search Geocoder",
   *   maxResults: 3,
   *   maxSuggestions: 6,
   *   suggestionsEnabled: false,
   *   minSuggestCharacters: 0
   * }, {
   *   featureLayer: new FeatureLayer({
   *     url: "https://services.arcgis.com/DO4gTjwJVIJ7O9Ca/arcgis/rest/services/GeoForm_Survey_v11_live/FeatureServer/0",
   *     outFields: ["*"]
   *   }),
   *   searchFields: ["Email", "URL"],
   *   displayField: "Email",
   *   exactMatch: false,
   *   outFields: ["*"],
   *   name: "Point FS",
   *   placeholder: "example: esri",
   *   maxResults: 6,
   *   maxSuggestions: 6,
   *   suggestionsEnabled: true,
   *   minSuggestCharacters: 0
   * },
   * {
   *   featureLayer: new FeatureLayer({
   *     outFields: ["*"]
   *   });
   *   placeholder: "esri",
   *   name: "A FeatureLayer",
   *   prefix: "",
   *   suffix: "",
   *   maxResults: 1,
   *   maxSuggestions: 6,
   *   exactMatch: false,
   *   searchFields: [], // defaults to FeatureLayer.displayField
   *   displayField: "", // defaults to FeatureLayer.displayField
   *   minSuggestCharacters: 0
   * }
   * ];
   *
   * @example
   * // Set source(s) on creation
   * var searchWidget = new Search({
   *   sources: []
   * });
   *
   * @example
   * // Set source(s)
   * var searchWidget = new Search();
   * var sources = [{ ... }, { ... }, { ... }]; //array of sources
   * searchWidget.sources = sources;
   *
   * @example
   * // Add to source(s)
   * var searchWidget = new Search();
   * searchWidget.sources.push({ ... });  //new source
   */
  @aliasOf("viewModel.sources")
  @renderable()
  sources: Collection<LocatorSearchSource | FeatureLayerSearchSource> = null;

  //----------------------------------
  //  state
  //----------------------------------

  /**
   * The current state of the widget.
   *
   * **Known Values:** ready | disabled | searching
   *
   * @name state
   * @instance
   * @type {string}
   * @default ready
   * @readonly
   * @since 4.6
   *
   */
  @property({
    readOnly: true,
    dependsOn: ["sources.length"]
  })
  @renderable()
  get state(): State {
    return this.sources.length === 0 ?
      "disabled" :
      this._searching ?
        "searching" :
        "ready";
  }

  //----------------------------------
  //  suggestions
  //----------------------------------

  /**
   * An array of results from the [suggest method](#suggest).
   *
   * This is available if working with a 10.3 geocoding service that has [suggest capability
   * loaded](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) or a
   * 10.3 feature layer that supports pagination, i.e. `supportsPagination = true`.
   *
   * @name suggestions
   * @instance
   * @type {module:esri/widgets/Search~SuggestResult[]}
   * @readonly
   */
  @aliasOf("viewModel.suggestions")
  @renderable()
  suggestions: SearchResults<SuggestResult>[] = null;

  //----------------------------------
  //  suggestionsEnabled
  //----------------------------------

  /**
   * Enable suggestions for the widget.
   *
   * This is only available if working with a 10.3 geocoding service that has [suggest capability
   * loaded](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) or a 10.3 feature layer that supports pagination, i.e. `supportsPagination = true`.
   *
   * @name suggestionsEnabled
   * @instance
   * @type {boolean}
   * @default true
   */
  @aliasOf("viewModel.suggestionsEnabled")
  suggestionsEnabled: boolean = null;

  //----------------------------------
  //  view
  //----------------------------------

  /**
   * A reference to the {@link module:esri/views/MapView} or {@link module:esri/views/SceneView}. Set this to link the widget to a specific view.
   *
   * @name view
   * @instance
   * @type {module:esri/views/MapView | module:esri/views/SceneView}
   */
  @aliasOf("viewModel.view")
  @renderable()
  view: MapView | SceneView = null;

  //----------------------------------
  //  viewModel
  //----------------------------------

  /**
   * The view model for this widget. This is a class that contains all the logic
   * (properties and methods) that controls this widget's behavior. See the
   * {@link module:esri/widgets/Search/SearchViewModel} class to access
   * all properties and methods on the widget.
   *
   * @name viewModel
   * @instance
   * @type {module:esri/widgets/Search/SearchViewModel}
   * @autocast
   */
  @vmEvent([
    "search-complete",
    "search-clear",
    "search-start",
    "select-result",
    "suggest-start",
    "suggest-complete"
  ])
  @property({
    type: SearchViewModel
  })
  @renderable([
    "viewModel.activeSource.placeholder",
    "viewModel.activeSource.name"
  ])
  viewModel = new SearchViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Clears the current searchTerm, search results, suggest results, graphic, and graphics layer.
   * It also hides any open menus.
   */
  @aliasOf("viewModel.clear")
  clear(): void { }

  /**
   * Brings focus to the widget's text input.
   *
   * @method
   */
  focus() {
    if (!this._inputNode) {
      return;
    }

    this.activeMenu = "suggestion";
    this._inputNode.focus();
    this.emit("search-focus");
  }

  /**
   * Unfocuses the widget's text input.
   *
   * @method
   */
  blur(event?: FocusEvent) {
    if (!this._inputNode) {
      return;
    }

    this._inputNode.blur();
    this._inputBlur(event);
    this.emit("search-blur");
  }

  /**
   * Depending on the sources specified, search() queries the feature layer(s) and/or performs
   * address matching using any specified {@link module:esri/tasks/Locator Locator(s)} and
   * returns any applicable results.
   *
   * @param {string|module:esri/geometry/Geometry|module:esri/widgets/Search~SuggestResult|number[][]} [searchTerm] - This searchTerm can be
   *        a string, geometry, suggest candidate object, or an array of [longitude,latitude] coordinate pairs.
   *        If a geometry is supplied, then it will reverse geocode (locator) or
   *        findAddressCandidates with geometry instead of text.
   *
   * @return {Promise<module:esri/widgets/Search~SearchResponse>} When resolved, returns a [SearchResponse](#SearchResponse) containing a
   *                   [SearchResult](#SearchResult).
   */

  search(searchItem?: SearchItem): IPromise<SearchResponse<SearchResults<SearchResult>>> {
    this.activeMenu = "none";

    this._cancelSuggest();

    const searching = this.viewModel.search(searchItem).then(searchResponse => {
      this.activeMenu = !searchResponse.numResults ? "warning" : "none";
      return searchResponse;
    }).otherwise(() => {
      this.activeMenu = "none";
      return null;
    }).always((result: any) => {
      this._searching = null;
      this.notifyChange("state");
      return result;
    });

    this._searching = searching.isFulfilled() ? null : searching;
    this.notifyChange("state");

    return searching;
  }

  /**
   * Performs a suggest() request on the active Locator. It also uses the current value of
   * the widget or one that is passed in.
   *
   * Suggestions are available if working with a 10.3 geocoding service that has
   * [suggest capability
   * loaded](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) or a 10.3 feature layer that supports pagination, i.e.
   * `supportsPagination = true`.
   *
   * @param {string} [value] - The string value used to suggest() on an active Locator or feature layer. If
   *                         nothing is passed in, takes the current value of the widget.
   *
   *
   * @return {Promise<module:esri/widgets/Search~SuggestResponse>} When resolved, returns [SuggestResponse](#SuggestResponse) containing an array of result objects. Each of these results contains a [SuggestResult](#SuggestResult).
   */
  suggest(query?: string): IPromise<SearchResponse<SearchResults<SuggestResult>>> {
    this._cancelSuggest();

    const suggestPromise = this.viewModel.suggest(query).then(suggestResponse => {
      if (suggestResponse.numResults) {
        this.activeMenu = "suggestion";
      }
      this._scrollToTopSuggestion();
      return suggestResponse;
    }).otherwise(() => {
      return null;
    });

    this._suggestPromise = suggestPromise;

    return suggestPromise;
  }

  render() {
    const vm = this.viewModel;

    const { placeholder, searchTerm } = vm;

    const sourceName = this._getSourceName(vm.activeSourceIndex);

    const trimmedSearchTerm = `${searchTerm}`.trim();

    const { activeMenu, id, state } = this;

    const suggestionsMenuId = `${this.id}-suggest-menu`;

    const inputNode = (
      <input bind={this}
        placeholder={placeholder}
        aria-label={i18n.searchButtonTitle}
        maxlength={vm.maxInputLength}
        autocomplete="off"
        type="text"
        tabindex="0"
        class={CSS.input}
        aria-autocomplete="list"
        value={searchTerm}
        aria-haspopup="true"
        aria-owns={suggestionsMenuId}
        role="textbox"
        onkeydown={this._handleInputKeydown}
        onkeyup={this._handleInputKeyup}
        onclick={this._handleInputClick}
        oninput={this._handleInputPaste}
        onpaste={this._handleInputPaste}
        afterCreate={this._storeInputNode}
        afterUpdate={this._storeInputNode}
        onfocusout={this._storeRelatedTarget}
        onfocus={this.focus}
        onblur={this.blur}
        title={searchTerm ? "" : placeholder} />
    );

    const formNode = (
      <form
        key="esri-search__form"
        bind={this} class={CSS.form}
        onsubmit={this._formSubmit}
        role="search">{inputNode}</form>
    );

    const clearButtonNode = searchTerm ? (
      <div
        key="esri-search__clear-button"
        bind={this}
        role="button"
        class={join(CSS.clearButton, CSS.button)}
        tabindex="0"
        title={i18n.clearButtonTitle}
        onfocus={this._clearButtonFocus}
        onclick={this._handleClearButtonClick}
        onkeydown={this._handleClearButtonClick}><span aria-hidden="true" class={CSS.clearIcon} />
      </div>
    ) : null;

    const locationEnabled = this.locationEnabled && this._supportsGeolocation && !trimmedSearchTerm;

    const locationSuggestGroupNode = locationEnabled ? (
      <ul key={`esri-search__suggestion-list-current-location`}>
        <li
          bind={this}
          onclick={this._handleUseCurrentLocationClick}
          onkeydown={this._handleUseCurrentLocationClick}
          onkeyup={this._handleSuggestionKeyup}
          role="menuitem"
          tabindex="-1">
          <span aria-hidden="true" role="presentation" class={CSS.locate} /> {i18n.useCurrentLocation}
        </li>
      </ul>
    ) : null;

    const showMultipleSourceResults = vm.sources.length > 1 && vm.activeSourceIndex === SearchViewModel.ALL_INDEX;

    const suggestionsGroupNode = vm.suggestions ? vm.suggestions.map((suggestResults, suggestResultsIndex) => {
      const { sourceIndex } = suggestResults;
      const suggestResultCount = suggestResults.results.length;
      const suggestHeaderNode = suggestResultCount && showMultipleSourceResults ?
        this._getSuggestionHeaderNode(sourceIndex) :
        null;

      const results = suggestResults.results as SuggestResult[];

      const suggestItemsNodes = results.map((suggestion, suggestionIndex) => this._getSuggestionNode(suggestion, suggestionIndex, sourceIndex));

      const suggestionListContainerNode = suggestResultCount ? (
        <ul key={`esri-search__suggestion-list-${sourceIndex}`}>
          {suggestItemsNodes}
        </ul>
      ) : null;

      return [
        suggestHeaderNode,
        suggestionListContainerNode
      ];
    }) : null;

    const suggestionsMenuNode = (
      <div
        id={suggestionsMenuId}
        aria-expanded={activeMenu === "suggestion"}
        key="esri-search__suggestions-menu"
        class={join(CSS.menu, CSS.suggestionsMenu)}
        role="menu"
        bind={this}
        afterCreate={this._storeSuggestionsListNode}
        afterUpdate={this._storeSuggestionsListNode}>
        {locationSuggestGroupNode}
        {suggestionsGroupNode}
      </div>
    );

    const inputContainerNode = (
      <div key="esri-search__input-container" class={CSS.inputContainer}>
        {formNode}
        {suggestionsMenuNode}
        {clearButtonNode}
      </div>
    );

    const submitButtonNode = (
      <div
        key="esri-search__submit-button"
        bind={this} role="button"
        title={i18n.searchButtonTitle}
        class={join(CSS.submitButton, CSS.button)}
        tabindex="0"
        onclick={this._handleSearchButtonClick}
        onkeydown={this._handleSearchButtonClick}>
        <span aria-hidden="true" role="presentation" class={CSS.searchIcon} />
        <span class={CSS.fallbackText}>{i18n.searchButtonTitle}</span>
      </div>
    );

    const notFoundText = trimmedSearchTerm ? esriLang.substitute({
      value: `"${searchTerm}"`
    }, i18n.noResultsFoundForValue) : i18n.noResultsFound;

    const warningNode = vm.get("selectedSuggestion.location") || trimmedSearchTerm ? (
      <div key="esri-search__no_results">
        <div class={CSS.warningMenuHeader}>{i18n.noResults}</div>
        <div class={CSS.warningMenuText}>{notFoundText}</div>
      </div>
    ) : null;

    const emptySearchTermNode = !vm.get("selectedSuggestion.location") && !trimmedSearchTerm ? (
      <div key="esri-search__empty-search">
        <span aria-hidden="true" class={CSS.noticeIcon} />
        <span class={CSS.noValueText}>{i18n.emptyValue}</span>
      </div>
    ) : null;

    const errorMenuNode = (
      <div key="esri-search__error-menu" class={join(CSS.menu, CSS.warningMenu)}>
        <div class={CSS.warningMenuBody}>
          {warningNode}
          {emptySearchTermNode}
        </div>
      </div>
    );

    const { sources } = vm;
    const hasMultipleSources = sources.length > 1;
    const sourceList = sources && sources.toArray();
    const allItemNode = vm.searchAllEnabled ? this._getSourceNode(SearchViewModel.ALL_INDEX) : null;
    const sourceMenuId = `${id}-source-menu`;

    const sourceMenuButtonNode = hasMultipleSources ? (
      <div
        key="esri-search__source-menu-button"
        bind={this}
        role="button"
        title={i18n.searchIn}
        aria-haspopup="true"
        aria-expanded={activeMenu === "source"}
        aria-controls={sourceMenuId}
        class={join(CSS.sourcesButton, CSS.button)}
        tabindex="0"
        onkeydown={this._handleSourceMenuButtonKeydown}
        onclick={this._handleSourcesMenuToggleClick}
        onkeyup={this._handleSourceMenuButtonKeyup}
        onblur={this._sourcesButtonBlur}
        afterCreate={this._storeSourceMenuButtonNode}
        afterUpdate={this._storeSourceMenuButtonNode}>
        <span
          aria-hidden="true"
          role="presentation"
          class={CSS.dropdownIcon} /><span
          aria-hidden="true"
          role="presentation"
          class={CSS.dropupIcon} /><span class={CSS.sourceName}>{sourceName}</span>
      </div>
    ) : null;

    const sourcesListNode = hasMultipleSources ? (
      <ul bind={this}
        afterCreate={this._storeSourcesListNode}
        afterUpdate={this._storeSourcesListNode}>
        {allItemNode}
        {sourceList.map((source, sourceIndex) => this._getSourceNode(sourceIndex))}
      </ul>
    ) : null;

    const sourcesMenuNode = (
      <div
        id={sourceMenuId}
        key="esri-search__source-menu"
        class={join(CSS.menu, CSS.sourcesMenu)}
        role="menu">
        {sourcesListNode}
      </div>
    );

    const containerNodeClasses = {
      [CSS.hasMultipleSources]: hasMultipleSources,
      [CSS.isSearchLoading]: state === "searching",
      [CSS.showWarning]: activeMenu === "warning",
      [CSS.showSources]: activeMenu === "source",
      [CSS.showSuggestions]: activeMenu === "suggestion"
    };

    const baseClasses = {
      [CSS.disabled]: state === "disabled"
    };

    return (
      <div class={CSS.base} classes={baseClasses}>
        <div
          role="presentation"
          classes={containerNodeClasses}
          class={CSS.container}>
          {sourceMenuButtonNode}
          {sourcesMenuNode}
          {inputContainerNode}
          {submitButtonNode}
          {errorMenuNode}
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _handleSourceMenuButtonKeydown(event: KeyboardEvent): void {
    const { keyCode } = event;

    if (
      keyCode === UP_ARROW ||
      keyCode === DOWN_ARROW ||
      keyCode === END ||
      keyCode === HOME
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.activeMenu = "source";
      return;
    }

    this._handleSourcesMenuToggleClick(event);
  }

  @accessibleHandler()
  private _handleSourcesMenuToggleClick(event: KeyboardEvent | MouseEvent): void {
    const isSourceActive = this.activeMenu === "source";
    this.activeMenu = isSourceActive ? "none" : "source";

    this.renderNow();

    if (isSourceActive) {
      this._sourceMenuButtonNode && this._sourceMenuButtonNode.focus();
      return;
    }

    const list = this._sourceListNode ? query<HTMLElement>("li", this._sourceListNode) : null;

    if (!list) {
      return;
    }

    const { keyCode } = event as KeyboardEvent;
    const focusNode = keyCode === END ? list[list.length - 1] : list[0];
    focusNode && focusNode.focus();
  }

  @accessibleHandler()
  private _handleClearButtonClick(): void {
    this.viewModel.clear();
    this._focus();
  }

  @accessibleHandler()
  private _handleSearchButtonClick(): void {
    this.search();
  }

  @accessibleHandler()
  private _handleSuggestionClick(event: Event): void {
    const node = event.currentTarget as HTMLElement;
    const suggestResult = node["data-suggestion"] as SuggestResult;
    if (suggestResult) {
      this._focus();
      this.search(suggestResult);
    }
  }

  @accessibleHandler()
  private _handleUseCurrentLocationClick(): void {
    this._focus("none");

    const searching = geolocationUtils.getCurrentPosition().then(position => {
      return geolocationUtils.positionToPoint(position, this.view).then(point => {
        return this.search(point);
      });
    }).always((result: any) => {
      this._searching = null;
      this.notifyChange("state");
      return result;
    });

    this._searching = searching.isFulfilled() ? null : searching;
    this.notifyChange("state");
  }

  @accessibleHandler()
  private _handleSourceClick(event: Event): void {
    const vm = this.viewModel;
    const node = event.currentTarget as HTMLElement;
    const sourceIndex = node["data-source-index"] as number;
    vm.activeSourceIndex = sourceIndex;
    this._focus("none");
  }

  private _sourcesButtonBlur(event: FocusEvent): void {
    const relatedTarget = event && event.relatedTarget as HTMLElement;
    this._removeActiveMenu(relatedTarget, this._sourceListNode);
  }

  private _inputBlur(event: FocusEvent): void {
    const relatedTarget = event && event.relatedTarget as HTMLElement;
    this._removeActiveMenu(relatedTarget ? relatedTarget : this._relatedTarget, this._suggestionListNode);
  }

  private _storeRelatedTarget(event: FocusEvent) {
    this._relatedTarget = event.relatedTarget as HTMLElement;
  }

  private _clearButtonFocus(): void {
    this.activeMenu = "none";
  }

  private _removeActiveMenu(targetNode: HTMLElement, parentNode: HTMLElement): void {
    if (targetNode && parentNode && parentNode.contains(targetNode)) {
      return;
    }

    this.activeMenu = "none";
  }

  private _cancelSuggest(): void {
    const suggestPromise = this._suggestPromise;

    if (suggestPromise) {
      suggestPromise.cancel();
      this._suggestPromise = null;
    }
  }

  private _storeSuggestionsListNode(div: HTMLDivElement): void {
    this._suggestionListNode = div;
  }

  private _storeSourcesListNode(ul: HTMLUListElement): void {
    this._sourceListNode = ul;
  }

  private _storeInputNode(inputElement: HTMLInputElement): void {
    this._inputNode = inputElement;
  }

  private _storeSourceMenuButtonNode(divElement: HTMLDivElement): void {
    this._sourceMenuButtonNode = divElement;
  }

  private _handleInputKeydown(event: KeyboardEvent): void {
    const { keyCode } = event;
    if (keyCode === TAB || keyCode === ESCAPE || (event.shiftKey && keyCode === TAB)) {
      this._cancelSuggest();
    }
  }

  private _handleInputKeyup(event: KeyboardEvent): void {
    const { keyCode } = event;
    const isIgnorableKey = event.ctrlKey || event.metaKey || keyCode === copyKey || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === ENTER || keyCode === SHIFT;

    const list = this._suggestionListNode ? query<HTMLElement>("li", this._suggestionListNode) : null;

    if (isIgnorableKey) {
      return;
    }

    if (keyCode === TAB || keyCode === ESCAPE || (event.shiftKey && keyCode === TAB)) {
      this._cancelSuggest();

      if (keyCode === ESCAPE) {
        this.activeMenu = "none";
      }

      return;
    }

    if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && list) {
      this.activeMenu = "suggestion";
      event.stopPropagation();
      event.preventDefault();
      this._cancelSuggest();
      const focusIndex = keyCode === UP_ARROW ? list.length - 1 : 0;
      const focusNode = list[focusIndex];
      focusNode && focusNode.focus();
      return;
    }

    if (!this.viewModel.searchTerm) {
      return;
    }

    this.suggest();
  }

  private _scrollToTopSuggestion(): void {
    if (this._suggestionListNode) {
      this._suggestionListNode.scrollTop = 0;
    }
  }

  private _handleInputClick(event: Event): void {
    this.activeMenu = "suggestion";
  }

  private _handleInputPaste(event: Event): void {
    const vm = this.viewModel;
    const input: any = event.target as HTMLInputElement;
    if (vm.searchTerm !== input.value) {
      vm.searchTerm = input.value;
    }

    if (!vm.searchTerm) {
      return;
    }

    this.suggest();
  }

  private _handleSourceMenuButtonKeyup(event: KeyboardEvent): void {
    const { keyCode } = event;

    if (
      keyCode !== UP_ARROW &&
      keyCode !== DOWN_ARROW &&
      keyCode !== HOME &&
      keyCode !== END
    ) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const list = this._sourceListNode ? query<HTMLElement>("li", this._sourceListNode) : null;

    if (!list) {
      return;
    }

    const cursorIndex = keyCode === UP_ARROW || keyCode === END ? list.length - 1 : 0;
    const focusNode = list[cursorIndex];
    focusNode && focusNode.focus();
  }

  private _handleSourceKeyup(event: KeyboardEvent): void {
    const node = event.target as HTMLElement;
    const list = this._sourceListNode ? query<HTMLElement>("li", this._sourceListNode) : null;
    const { keyCode } = event;

    if (keyCode === ESCAPE) {
      this._focus("none");
      this._sourceMenuButtonNode && this._sourceMenuButtonNode.focus();
      return;
    }

    if (list) {
      const itemIndex = list.indexOf(node);

      if (
        keyCode === HOME ||
        keyCode === END ||
        keyCode === UP_ARROW ||
        keyCode === DOWN_ARROW
      ) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (keyCode === HOME) {
        const homeFocusNode = list[0];
        homeFocusNode && homeFocusNode.focus();
        return;
      }

      if (keyCode === END) {
        const endFocusNode = list[list.length - 1];
        endFocusNode && endFocusNode.focus();
        return;
      }

      if (keyCode === UP_ARROW) {
        const previousItemIndex = itemIndex - 1;
        const previousFocusNode = previousItemIndex < 0 ?
          this._sourceMenuButtonNode :
          list[previousItemIndex];
        previousFocusNode && previousFocusNode.focus();
        return;
      }

      if (keyCode === DOWN_ARROW) {
        const nextItemIndex = itemIndex + 1;
        const nextFocusNode = nextItemIndex >= list.length ?
          this._sourceMenuButtonNode :
          list[nextItemIndex];
        nextFocusNode && nextFocusNode.focus();
      }
    }

  }

  private _handleSuggestionKeyup(event: KeyboardEvent): void {
    const node = event.target as HTMLElement;
    const list = this._suggestionListNode ? query<HTMLElement>("li", this._suggestionListNode) : null;
    const itemIndex = list.indexOf(node);
    const { keyCode } = event;

    this._cancelSuggest();

    if (keyCode === BACKSPACE || keyCode === DELETE) {
      this._focus();
      return;
    }

    if (keyCode === ESCAPE) {
      this._focus("none");
      return;
    }

    if (list) {
      if (
        keyCode === HOME ||
        keyCode === END ||
        keyCode === UP_ARROW ||
        keyCode === DOWN_ARROW
      ) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (keyCode === HOME) {
        const homeFocusNode = list[0];
        homeFocusNode && homeFocusNode.focus();
      }

      if (keyCode === END) {
        const endFocusNode = list[list.length - 1];
        endFocusNode && endFocusNode.focus();
      }

      if (keyCode === UP_ARROW) {
        const previousItemIndex = itemIndex - 1;
        const previousFocusNode = previousItemIndex < 0 ? list[list.length - 1] : list[previousItemIndex];
        previousFocusNode && previousFocusNode.focus();
        return;
      }

      if (keyCode === DOWN_ARROW) {
        const nextItemIndex = itemIndex + 1;
        const nextFocusNode = nextItemIndex >= list.length ? list[0] : list[nextItemIndex];
        nextFocusNode && nextFocusNode.focus();
        return;
      }
    }

  }

  private _focus(activeMenu?: ActiveMenu): void {
    this.focus();

    if (!activeMenu) {
      return;
    }

    this.activeMenu = activeMenu;
  }

  private _formSubmit(event: Event): void {
    event.preventDefault();
    this.search();
  }

  private _getSourceName(sourceIndex: number): string {
    const vm = this.viewModel;
    const { sources } = vm;
    const source = sources.getItemAt(sourceIndex);
    return sourceIndex === SearchViewModel.ALL_INDEX ?
      i18n.all : source ? source.name : i18n.untitledSource;
  }

  private _getSuggestionHeaderNode(sourceIndex: number) {
    const name = this._getSourceName(sourceIndex);
    return (
      <div key={`esri-search__suggestion-header-${sourceIndex}`} class={CSS.header}>{name}</div>
    );
  }

  private _splitResult(input: string, needle: string): string[] {
    const escapedNeedle = regexp.escapeString(needle);
    const matches = input.replace(new RegExp(`(^|)(${escapedNeedle})(|$)`, "ig"), "$1|$2|$3");
    return matches.split("|");
  }

  private _getSuggestionNode(suggestion: SuggestResult, suggestionIndex: number, sourceIndex: number): any {
    const vm = this.viewModel;
    const { searchTerm } = vm;
    if (searchTerm) {
      const { text } = suggestion;
      const resultText = text || i18n.untitledResult as string;
      const resultParts = this._splitResult(resultText, searchTerm);
      const searchTermLC = searchTerm.toLowerCase();
      const matches: any = [];

      resultParts.forEach((part, partIndex) => {
        if (part && part.length) {
          const keyNumber = `${sourceIndex}-${suggestionIndex}-${partIndex}`;
          if (part.toLowerCase() === searchTermLC) {
            matches.push(<strong key={`esri-search__partial-match-${keyNumber}`}>{part}</strong>);
          }
          else {
            matches.push(part);
          }
        }
      });

      return (
        <li bind={this}
          onclick={this._handleSuggestionClick}
          onkeydown={this._handleSuggestionClick}
          onkeyup={this._handleSuggestionKeyup}
          key={`esri-search__suggestion$-{sourceIndex}_${suggestionIndex}`}
          data-suggestion={suggestion}
          role="menuitem"
          tabindex="-1">{matches}</li>
      );
    }
  }

  private _getSourceNode(sourceIndex: number): any {
    const itemClasses = {
      [CSS.activeSource]: sourceIndex === this.viewModel.activeSourceIndex
    };

    return (
      <li bind={this}
        key={`esri-search__source-${sourceIndex}`}
        onclick={this._handleSourceClick}
        onkeydown={this._handleSourceClick}
        onkeyup={this._handleSourceKeyup}
        data-source-index={sourceIndex}
        role="menuitem"
        class={CSS.source}
        classes={itemClasses}
        tabindex="-1">{this._getSourceName(sourceIndex)}</li>
    );
  }

  private _renderSearchResultsContent() {
    this._searchResultRenderer.showMoreResultsOpen = false;
    this._searchResultRenderer.viewModel = this.viewModel;
    return this._searchResultRenderer;
  }

}

export = Search;
