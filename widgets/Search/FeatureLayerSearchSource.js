// COPYRIGHT © 2017 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.6/esri/copyright.txt for details.

define(["require","exports","../../core/tsSupport/declareExtendsHelper","../../core/tsSupport/decorateHelper","../../core/tsSupport/assignHelper","../../core/lang","../../layers/FeatureLayer","./SearchSource","./support/featureLayerUtils","../../core/accessorSupport/decorators"],function(e,t,r,s,a,i,o,l,u,n){var p=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.displayField=null,t.exactMatch=null,t.searchFields=null,t.searchQueryParams=null,t.searchTemplate=null,t.suggestionTemplate=null,t.suggestQueryParams=null,t}return r(t,e),l=t,Object.defineProperty(t.prototype,"featureLayer",{set:function(e){this._set("featureLayer",e),this._loadFeatureLayer()},enumerable:!0,configurable:!0}),t.prototype.clone=function(){return new l({autoNavigate:this.autoNavigate,filter:this.filter,maxResults:this.maxResults,maxSuggestions:this.maxSuggestions,minSuggestCharacters:this.minSuggestCharacters,outFields:this.outFields?i.clone(this.outFields):null,placeholder:this.placeholder,popup:this.popup,popupEnabled:this.popupEnabled,popupOpenOnSelect:this.popupOpenOnSelect,prefix:this.prefix,resultGraphicEnabled:this.resultGraphicEnabled,resultSymbol:this.resultSymbol?this.resultSymbol.clone():null,searchExtent:this.searchExtent?this.searchExtent.clone():null,suggestionsEnabled:this.suggestionsEnabled,suffix:this.suffix,withinViewEnabled:this.withinViewEnabled,displayField:this.displayField,exactMatch:this.exactMatch,featureLayer:this.featureLayer,searchFields:this.searchFields?i.clone(this.searchFields):null,searchQueryParams:this.searchQueryParams?i.clone(this.searchQueryParams):null,suggestionTemplate:this.suggestionTemplate,suggestQueryParams:this.suggestQueryParams?i.clone(this.suggestQueryParams):null,zoomScale:this.zoomScale})},t.prototype.getResults=function(e){return u.getResults(a({source:this},e))},t.prototype.getSuggestions=function(e){return u.getSuggestions(a({source:this},e))},t.prototype._getFirstStringField=function(){var e=this.featureLayer,t="";return e&&e.fields&&e.fields.some(function(e){return"string"===e.type?(t=e.name,!0):void 0}),t},t.prototype._getDisplayField=function(){return this.displayField||this.featureLayer.displayField||this._getFirstStringField()},t.prototype._setFallbackNameFromFeatureLayer=function(e){var t=this._getFeatureLayerTitle(e);t&&!this.name&&this._set("name",t)},t.prototype._loadFeatureLayer=function(){var e=this,t=this.featureLayer;t&&t.load().then(function(){e.featureLayer===t&&e._setFallbackNameFromFeatureLayer(t)})},t.prototype._getFeatureLayerTitle=function(e){var t=e.title,r="",s=this.searchFields||[this._getDisplayField()];return s.forEach(function(t,s){r+=0===s?": ":", ";var a=e.getField(t);r+=a&&a.alias||t}),t+r},s([n.property({json:{read:{source:"field.name"},write:{target:"field.name"}}})],t.prototype,"displayField",void 0),s([n.property({json:{read:{source:"field.exactMatch"},write:{target:"field.exactMatch"}}})],t.prototype,"exactMatch",void 0),s([n.property({type:o,value:null})],t.prototype,"featureLayer",null),s([n.property()],t.prototype,"searchFields",void 0),s([n.property()],t.prototype,"searchQueryParams",void 0),s([n.property()],t.prototype,"searchTemplate",void 0),s([n.property()],t.prototype,"suggestionTemplate",void 0),s([n.property()],t.prototype,"suggestQueryParams",void 0),t=l=s([n.subclass("esri.widgets.Search.FeatureLayerSearchSource")],t);var l}(n.declared(l));return p});