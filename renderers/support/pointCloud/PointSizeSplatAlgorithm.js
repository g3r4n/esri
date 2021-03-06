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

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","./PointSizeAlgorithm"],function(e,t,r,o,p,i){Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.type="splat",t.minSize=null,t.scaleFactor=1,t}return r(t,e),i=t,t.prototype.clone=function(){return new i({minSize:this.minSize,scaleFactor:this.scaleFactor})},o([p.property()],t.prototype,"type",void 0),o([p.property({type:Number,json:{write:!0}})],t.prototype,"minSize",void 0),o([p.property({type:Number,value:1,nonNullable:!0,json:{write:!0}})],t.prototype,"scaleFactor",void 0),t=i=o([p.subclass("esri.renderers.support.pointCloud.PointSizeSplatAlgorithm")],t);var i}(p.declared(i["default"]));t.PointSizeSplatAlgorithm=n,t["default"]=n});