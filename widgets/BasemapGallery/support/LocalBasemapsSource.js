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

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","../../../Basemap","../../../core/Accessor","../../../core/Collection"],function(e,r,o,t,p,s,a,c){var n=c.ofType(s),u=function(e){function r(r){var o=e.call(this)||this;return o.basemaps=new n,o.state="ready",o}return o(r,e),r.prototype.refresh=function(){},t([p.property({type:n})],r.prototype,"basemaps",void 0),t([p.property({readOnly:!0})],r.prototype,"state",void 0),r=t([p.subclass("esri.widgets.BasemapGallery.support.LocalBasemapsSource")],r)}(p.declared(a));return u});