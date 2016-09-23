// COPYRIGHT © 2016 Esri
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
// See http://js.arcgis.com/4.1/esri/copyright.txt for details.

define(["../../../../core/declare","../../../../Color","./Graphics3DSymbolLayer","./Graphics3DGraphicLayer","./ElevationAligners","./Graphics3DSymbolCommonCode","./graphicUtils","../i3s/I3SSymbolLoader","../../lib/glMatrix","../../webgl-engine/Stage","../../webgl-engine/lib/Geometry","../../webgl-engine/lib/GeometryUtil","../../webgl-engine/materials/Material","../../webgl-engine/lib/Util"],function(e,t,i,r,o,a,n,s,l,c,h,m,y,u){var p=u.assert,g=l.mat4d,_=l.vec3d,d=[1,1,1],v=d,f=d,b=[10,10,10],M=[c.ModelContentType.MATERIAL,c.ModelContentType.TEXTURE,c.ModelContentType.GEOMETRY],E=e([i],{_prepareResources:function(){var e=this.symbol,t=this._getStageIdHint();if(e.resource&&e.resource.href)this._prepareModelResources(e.resource.href,t);else{var i=e.resource?e.resource.primitive:"sphere";this._preparePrimitiveResources(i,t)}},_sizeToScale:function(e,t,i,r){for(var o=new Array(3),a=2;a>=0;a--){var n=e[a];null!==n&&isFinite(n)?o[a]=n/(t[a+3]-t[a]):"symbolValue"===n?o[a]=i?i[a]:1:o[a]=null}var s=r,l=0;for(a=2;a>=0;a--)n=o[a],null!==n&&(s=n,l=Math.max(l,Math.abs(n)));for(a=2;a>=0;a--)null===o[a]?o[a]=s:0===o[a]&&(o[a]=.001*l);return o},_computeSymbolScale:function(e,t){var i=[e.width,e.depth,e.height];return i[0]||i[1]||i[2]?this._sizeToScale(i,t,null,1):null},_preparePrimitiveResources:function(e,i){var r=this.symbol;if("sphere"===e)this._geometryData=m.createPolySphereGeometry(.5,2,!0),this._geometryOrigin="center";else if("cube"===e)this._geometryData=m.createBoxGeometry(1),this._geometryOrigin="center";else if("cylinder"===e)this._geometryData=m.createCylinderGeometry(1,.5,16,[0,0,1],[0,0,.5]),this._geometryOrigin="bottom";else if("cone"===e)r.height<0?(this._geometryData=m.createConeGeometry(1,.5,15,!0),r.height=-r.height):this._geometryData=m.createConeGeometry(1,.5,15,!1),m.cgToGIS(this._geometryData),this._geometryOrigin="bottom";else if("tetrahedron"===e)this._geometryData=m.createTetrahedronGeometry(1),m.cgToGIS(this._geometryData),this._geometryOrigin="bottom";else{if("diamond"!==e)return console.warn("Unknown object symbol primitive: "+e),void this.reject();this._geometryData=m.createDiamondGeometry(1),m.cgToGIS(this._geometryData),this._geometryOrigin="center"}this._geometry=new h(this._geometryData,i),this._context.stage.add(c.ModelContentType.GEOMETRY,this._geometry);var o=[-.5,-.5,-.5,.5,.5,.5];this._symbolScale=this._computeSymbolScale(r,o),this._boundingBox=o;var a=this._getMaterialOpacity(),n={specular:[0,0,0],shininess:3,opacity:a,transparent:1>a||this._isPropertyDriven("opacity"),instanced:this._hasPerInstanceColor()?["transformation","color"]:["transformation"]};if(this._isPropertyDriven("color"))n.ambient=v,n.diffuse=f;else{var s=r.material?t.toUnitRGB(r.material.color):d;n.ambient=s,n.diffuse=s}this._material=new y(n,i+"_objectmat"),this._context.stage.add(c.ModelContentType.MATERIAL,this._material),this.resolve()},_prepareModelResources:function(e,i){var r={materialParamsMixin:{instanced:this._hasPerInstanceColor()?["transformation","color"]:["transformation"]},idHint:i},o=new s(this._context.streamDataSupplier);o.fetchSymbol(e,r).then(function(e){if(!this.isRejected()){var i,r=e.stageResources,o=this._context.stage,a=this.symbol.material;if(this._isPropertyDriven("color"))i={ambient:v,diffuse:f};else if(a&&a.color){var n=t.toUnitRGB(a.color);i={ambient:n.map(function(e){return e/1.5}),diffuse:n}}var s=this._computeModelOpacityOverride();e.originalMaterialOpacities=new Array(r[c.ModelContentType.MATERIAL].length),r[c.ModelContentType.MATERIAL].forEach(function(t,r){var o=t.getParameterValues();e.originalMaterialOpacities[r]=o.opacity,i&&t.setParameterValues(i),s.overwrite?t.setParameterValues({opacity:s.overwrite,transparent:s.blendingRequired}):null!=s.multiply&&(o.opacity*=s.multiply,o.transparent=o.opacity<1,t.setParameterValues({opacity:o.opacity,transparent:o.transparent}))}),M.forEach(function(e){for(var t=r[e],i=0;t&&i<t.length;i++)o.add(e,t[i])});for(var l=r[c.ModelContentType.GEOMETRY],h=e.geometryTransformations,m=[Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE],y=[0,0,0],u=[0,0,0],p=0;p<l.length;p++)for(var d=l[p],b=0,E=d.getNumGroups();E>b;++b){var O=d.getBoundingInfo(b);g.multiplyVec3(h[p],O.getBBMin(),y),g.multiplyVec3(h[p],O.getBBMax(),u);for(var T=0;3>T;++T){if(y[T]>u[T]){var A=y[T];y[T]=u[T],u[T]=A}m[T]=Math.min(m[T],y[T]),m[T+3]=Math.max(m[T+3],u[T])}}this._boundingBox=m;var S=this.symbol;this._symbolScale=this._computeSymbolScale(S,m),_.scale(e.pivotOffset,-1);for(var P=h.length,R=0;P>R;R++)g.translate(h[R],e.pivotOffset);_.scale(e.pivotOffset,-1),this._i3sModel=e,this.resolve()}}.bind(this),function(){this.reject()}.bind(this))},_computeModelOpacityOverride:function(){var e={overwrite:null,blendingRequired:!1,multiply:null},t=this._getMaterialOpacity();return this._isPropertyDriven("opacity")?(e.overwrite=t,e.blendingRequired=!0):this.symbol.material&&void 0!==this.symbol.material.transparency?(e.overwrite=t,e.blendingRequired=e.overwrite<1):1>t&&(e.multiply=t,e.blendingRequired=!0),e},destroy:function(){this.isFulfilled()||this.reject();var e=this._context.stage;if(this._i3sModel){var t=this._i3sModel.stageResources;M.forEach(function(i){for(var r=t[i],o=0;r&&o<r.length;o++)e.remove(i,r[o].getId())})}else this._material&&e.remove(c.ModelContentType.MATERIAL,this._material.getId()),this._geometry&&e.remove(c.ModelContentType.GEOMETRY,this._geometry.getId())},createGraphics3DGraphic:function(e,t){var i=e.geometry;if("polyline"===i.type)i=a.placePointOnPolyline(i);else if("polygon"===i.type)i=a.placePointOnPolygon(i);else if("extent"===i.type)i=i.get("center");else if("point"!==i.type)return this._logWarning("unsupported geometry type for object symbol: "+i.type),null;var r="graphic"+e.uid,o=this._getGraphicElevationInfo(e);return this._createAs3DShape(e,i,t,o,r,e.uid)},layerPropertyChanged:function(e,t,i){if("opacity"===e){if(this._i3sModel){var r=this._computeModelOpacityOverride();this._i3sModel.stageResources[c.ModelContentType.MATERIAL].forEach(function(e,t){if(r.overwrite)e.setParameterValues({opacity:r.overwrite,transparent:r.blendingRequired});else{var i=this._i3sModel.originalMaterialOpacities[t];null!=r.multiply&&(i*=r.multiply),e.setParameterValues({opacity:i,transparent:1>i})}}.bind(this))}else{var n=this._getMaterialOpacity();this._material.setParameterValues({opacity:n,transparent:1>n||this._isPropertyDriven("opacity")})}return!0}if("elevationInfo"===e){this._updateElevationInfo();var s=this._context.elevationProvider,l=this._context.renderCoordsHelper,h=o.perObjectElevationAligner,m=a.ELEV_MODES.ABSOLUTE_HEIGHT;for(var y in t){var u=t[y],p=u._graphics[i];if(p){var g=u.graphic,_=this._getGraphicElevationInfo(g);p.elevationAligner=_.mode!==m?h:null,p.elevationInfo.set(_),h(p,s,l)}}return!0}return!1},_createAs3DShape:function(e,t,i,s,l,h){var m,y=this._hasPerInstanceColor()?{color:n.mixinColorAndOpacity(i.color,i.opacity)}:null,u=this._computeObjectScale(i,!this._i3sModel),p=this._context.layer.id;if(this._i3sModel){var _=this._i3sModel.stageResources[c.ModelContentType.GEOMETRY],d=this._i3sModel.materialsByComponent,v=this._i3sModel.geometryTransformations;if(m=a.createStageObjectForPoint.call(this,t,null,null,null,null,s,l,p,h),null===m)return null;for(var f=0;f<_.length;f++){var b=g.identity();this._applyObjectRotation(i,this.symbol,b),u&&g.scale(b,u),g.multiply(b,v[f]);for(var M=d[f],E=M.length,O=new Array(E),T=0;E>T;T++)O[T]=y;m.addGeometry(_[f],M,b,O)}}else{var A,S=this.symbol;"bottom"===S.anchor&&"center"===this._geometryOrigin?A=[0,0,.5]:"center"===S.anchor&&"bottom"===this._geometryOrigin&&(A=[0,0,-.5]);var P=g.identity();this._applyObjectRotation(i,this.symbol,P),u&&g.scale(P,u),A&&g.translate(P,A),m=a.createStageObjectForPoint.call(this,t,[this._geometry],[[this._material]],[P],[y],s,l,p,h)}if(null===m)return null;m.setCastShadow(!0);var R=null;s.mode!==a.ELEV_MODES.ABSOLUTE_HEIGHT&&(R=o.perObjectElevationAligner);var G=new r(this,m,null,null,null,R,s,r.VisibilityModes.REMOVE_OBJECT);return a.extendPointGraphicElevationInfo(G,t,this._context.elevationProvider),G},_computeObjectScale:function(e,t){var i;e.size&&this._isPropertyDriven("size")?(i=this._sizeToScale(e.size,this._boundingBox,this._symbolScale,null),p(null!=i[0],"sizeInfo has no values")):i=this._symbolScale?this._symbolScale.slice(0):t?b.slice(0):[1,1,1];for(var r=this._context.renderCoordsHelper.unitInMeters,o=2;o>=0;o--)i[o]/=r;return 1!==i[0]||1!==i[1]||1!==i[2]?i:null},_applyObjectRotation:function(e,t,i){var r=e.rotationAngle||0,o=t.heading||0,a=r+o;return 0!==a?g.rotateZ(i,-a/180*Math.PI,i):null},_hasPerInstanceColor:function(){return this._isPropertyDriven("color")||this._isPropertyDriven("opacity")}});return E});