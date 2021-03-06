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

define(["require","exports","dojo/_base/lang","../../../core/promiseUtils","../../support/utils","./support/utils","./color","./size","../support/utils","../../support/AuthoringInfo"],function(e,r,i,a,s,t,n,l,o,u){function c(e){if(!(e&&e.layer&&(e.field||e.valueExpression||e.sqlExpression)))return a.reject(t.createError("univariate-colorsize-visual-variables:missing-parameters","'layer' and 'field', 'valueExpression' or 'sqlExpression' parameters are required"));var r=i.mixin({},e),s=[0,1],n=o.createLayerAdapter(r.layer,s);return r.layer=n,n?n.load().then(function(){var e=o.getFieldsList({field:r.field,normalizationField:r.normalizationField,valueExpression:r.valueExpression}),i=t.verifyBasicFieldValidity(n,e,"univariate-colorsize-visual-variables:invalid-parameters");return i?a.reject(i):r}):a.reject(t.createError("univariate-colorsize-visual-variables:invalid-parameters","'layer' must be one of these types: "+o.getLayerTypeLabels(s).join(", ")))}function d(e,r){var a=i.mixin({},e),s=0===r?a.colorOptions:a.sizeOptions;return delete a.sizeOptions,delete a.colorOptions,i.mixin(a,s)}function p(e){if(!(e&&e.layer&&(e.field||e.valueExpression||e.sqlExpression)))return a.reject(t.createError("univariate-colorsize-continuous-renderer:missing-parameters","'layer' and 'field', 'valueExpression' or 'sqlExpression' parameters are required"));var r=i.mixin({},e);r.symbolType=r.symbolType||"2d";var s=[0,1],n=o.createLayerAdapter(r.layer,s);return r.layer=n,n?n.load().then(function(){var e=o.getFieldsList({field:r.field,normalizationField:r.normalizationField,valueExpression:r.valueExpression}),i=t.verifyBasicFieldValidity(n,e,"univariate-colorsize-continuous-renderer:invalid-parameters");return i?a.reject(i):r}):a.reject(t.createError("univariate-colorsize-continuous-renderer:invalid-parameters","'layer' must be one of these types: "+o.getLayerTypeLabels(s).join(", ")))}function v(e){var r=i.mixin({},e),a=r.sizeOptions;return delete r.sizeOptions,delete r.colorOptions,i.mixin(r,a)}function f(e){var r=i.mixin({},e),a=r.symbolType,s=a.indexOf("3d-volumetric")>-1;delete r.symbolType,delete r.defaultSymbolEnabled;var t=r;return t.worldScale=s,s&&(t.sizeOptions=i.mixin({},t.sizeOptions),t.sizeOptions.axis="3d-volumetric-uniform"===a?"all":"height"),t}function m(e){return c(e).then(function(e){var r;return n.createVisualVariable(d(e,0)).then(function(i){var a=d(e,1);return a.statistics=i.statistics,r=i,l.createVisualVariables(a)}).then(function(e){var i=r.visualVariable,a=e.visualVariables,s=i.stops.length;a.forEach(function(e){null!=e.minDataValue&&(e.minDataValue=i.stops[0].value,e.maxDataValue=i.stops[s-1].value)});var t=r.authoringInfo.visualVariables[0],n=e.authoringInfo.visualVariables[0],l=new u({type:"univariate-color-size",visualVariables:[t.clone(),n.clone()]});return{basemapId:e.basemapId,statistics:r.statistics,defaultValuesUsed:r.defaultValuesUsed,color:{visualVariable:i,colorScheme:r.colorScheme},size:{visualVariables:a,sizeScheme:e.sizeScheme},authoringInfo:l}})})}function b(e){return p(e).then(function(e){var r;return l.createContinuousRenderer(v(e)).then(function(i){var a=f(e);return a.statistics=i.statistics,r=i,m(a)}).then(function(e){var i=r.renderer;return i.visualVariables=e.size.visualVariables.map(function(e){return s.cloneSizeVariable(e)}),i.visualVariables.push(s.cloneColorVariable(e.color.visualVariable)),i.authoringInfo=e.authoringInfo&&e.authoringInfo.clone(),{renderer:i,statistics:r.statistics,defaultValuesUsed:r.defaultValuesUsed,color:e.color,size:e.size,basemapId:e.basemapId}})})}Object.defineProperty(r,"__esModule",{value:!0}),r.createVisualVariables=m,r.createContinuousRenderer=b});