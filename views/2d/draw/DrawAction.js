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

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","../../../core/Accessor","../../../core/Evented"],function(e,r,t,o,c,n,s){var p=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t(r,e),r.prototype.getCoordsFromScreenPoint=function(e){var r=this.view.toMap(e);return[r.x,r.y]},o([c.property()],r.prototype,"view",void 0),r=o([c.subclass("esri.views.2d.draw.DrawAction")],r)}(c.declared(n,s));return p});