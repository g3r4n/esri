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

define(["require","exports","../../core/tsSupport/declareExtendsHelper","../../core/tsSupport/decorateHelper","../../core/JSONSupport","./materialUtils","../../core/accessorSupport/decorators"],function(r,e,o,t,l,c,p){Object.defineProperty(e,"__esModule",{value:!0});var n=function(r){function e(){return null!==r&&r.apply(this,arguments)||this}return o(e,r),l=e,e.prototype.clone=function(){return new l({color:this.color?this.color.clone():null})},t([p.property(c.colorAndTransparencyProperty)],e.prototype,"color",void 0),e=l=t([p.subclass("esri.symbols.support.Symbol3DMaterial")],e);var l}(p.declared(l));e.Symbol3DMaterial=n,e["default"]=n});