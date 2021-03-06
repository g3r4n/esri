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

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","../../../core/Accessor"],function(t,e,r,o,i,n){var a={container:"esri-zoom-box__container",overlay:"esri-zoom-box__overlay",background:"esri-zoom-box__overlay-background",box:"esri-zoom-box__outline"},s={zoom:"Shift",counter:"Ctrl"},h=function(t){function e(e){var r=t.call(this,e)||this;return r._container=null,r._overlay=null,r._backgroundShape=null,r._boxShape=null,r._box={x:0,y:0,width:0,height:0},r._redraw=r._redraw.bind(r),r}return r(e,t),e.prototype.destroy=function(){this.view=null},Object.defineProperty(e.prototype,"view",{set:function(t){var e=this;this._handles&&this._handles.forEach(function(t){t.remove()}),this._handles=null,this._destroyOverlay(),this._set("view",t),t&&(t.on("drag",[s.zoom],function(t){return e._handleDrag(t,1)}),t.on("drag",[s.zoom,s.counter],function(t){return e._handleDrag(t,-1)}))},enumerable:!0,configurable:!0}),e.prototype._start=function(t,e,r,o){this._createContainer(),this._createOverlay(),this.navigation.begin()},e.prototype._update=function(t,e,r,o){this._box.x=t,this._box.y=e,this._box.width=r,this._box.height=o,this._rafId||(this._rafId=requestAnimationFrame(this._redraw))},e.prototype._end=function(t,e,r,o,i){var n=this.view,a=n.toMap(t+.5*r,e+.5*o),s=Math.max(r/n.width,o/n.height);-1===i&&(s=1/s),this._destroyOverlay(),this.navigation.end(),n.goTo({center:a,scale:n.scale*s})},e.prototype._updateBox=function(t,e,r,o){var i=this._boxShape;i.setAttributeNS(null,"x",""+t),i.setAttributeNS(null,"y",""+e),i.setAttributeNS(null,"width",""+r),i.setAttributeNS(null,"height",""+o),i.setAttributeNS(null,"class",a.box)},e.prototype._updateBackground=function(t,e,r,o){this._backgroundShape.setAttributeNS(null,"d",this._toSVGPath(t,e,r,o,this.view.width,this.view.height))},e.prototype._createContainer=function(){var t=document.createElement("div");t.className=a.container,this.view.root.appendChild(t),this._container=t},e.prototype._createOverlay=function(){var t=this.view.width,e=this.view.height,r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttributeNS(null,"d","M 0 0 L "+t+" 0 L "+t+" "+e+" L 0 "+e+" Z"),r.setAttributeNS(null,"class",a.background);var o=document.createElementNS("http://www.w3.org/2000/svg","rect"),i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),i.setAttributeNS(null,"class",a.overlay),i.appendChild(r),i.appendChild(o),this._container.appendChild(i),this._backgroundShape=r,this._boxShape=o,this._overlay=i},e.prototype._destroyOverlay=function(){this._container&&this._container.parentNode&&this._container.parentNode.removeChild(this._container),this._container=this._backgroundShape=this._boxShape=this._overlay=null},e.prototype._toSVGPath=function(t,e,r,o,i,n){var a=e,s=t,h=t+r,l=e+o;return"M 0 0 L "+i+" 0 L "+i+" "+n+" L 0 "+n+" ZM "+s+" "+a+" L "+s+" "+l+" L "+h+" "+l+" L "+h+" "+a+" Z"},e.prototype._handleDrag=function(t,e){var r,o,i,n,a=t.x,s=t.y,h=t.origin.x,l=t.origin.y;switch(a>h?(r=h,i=a-h):(r=a,i=h-a),s>l?(o=l,n=s-l):(o=s,n=l-s),t.action){case"start":this._start(r,o,i,n);break;case"update":this._update(r,o,i,n);break;case"end":this._end(r,o,i,n,e)}t.stopPropagation()},e.prototype._redraw=function(){if(this._rafId&&(this._rafId=null,this._overlay)){var t=this._box,e=t.x,r=t.y,o=t.width,i=t.height;this._updateBox(e,r,o,i),this._updateBackground(e,r,o,i),this._rafId=requestAnimationFrame(this._redraw)}},o([i.property()],e.prototype,"navigation",void 0),o([i.property()],e.prototype,"view",null),e=o([i.subclass("esri.views.2d.navigation.ZoomBox")],e)}(i.declared(n));return h});