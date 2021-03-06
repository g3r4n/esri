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

define(["require","exports","../../core/tsSupport/declareExtendsHelper","../../core/tsSupport/decorateHelper","../../core/JSONSupport","../../core/accessorSupport/decorators"],function(e,r,t,o,u,p){Object.defineProperty(r,"__esModule",{value:!0});var n=function(e){function r(){var r=null!==e&&e.apply(this,arguments)||this;return r.url="",r}return t(r,e),u=r,r.prototype.clone=function(){return new u({url:this.url})},o([p.property({type:String,json:{write:{isRequired:!0}}})],r.prototype,"url",void 0),r=u=o([p.subclass("esri.webscene.support.Thumbnail")],r);var u}(p.declared(u));r["default"]=n});