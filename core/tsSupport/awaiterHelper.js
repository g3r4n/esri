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

define(["dojo/Deferred","dojo/when"],function(e,n){function t(t,r,o,c){function u(e){try{i(c.next(e))}catch(n){a.reject(n)}}function f(e){try{i(c["throw"](e))}catch(n){a.reject(n)}}function i(e){e.done?n(e.value).then(a.resolve,a.reject):n(e.value).then(u,f)}var a=new e;return i((c=c.apply(t,r||[])).next()),a.promise}return t});