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

define(["require","exports","./Util","dojo/text!../materials/internal/offscreen.xml","../../../webgl/FramebufferObject","../../../webgl/Texture","../../../webgl/VertexArrayObject","../../../webgl/BufferObject","../../../webgl/Program","../../../webgl/Util","../../../webgl/enums","./DefaultVertexBufferLayouts","./DefaultVertexAttributeLocations"],function(e,t,r,i,a,h,u,s,n,f,o,l,d){var c={target:3553,pixelFormat:6408,dataType:5121,samplingMode:9729,wrapMode:33071,width:0,height:0},p={target:3553,pixelFormat:6408,dataType:32819,samplingMode:9729,wrapMode:33071,width:0,height:0},b=function(){function e(e,t){this._hudVisibilityTexture=null,this._enabled=!1,this.width=0,this.height=0,this._programRep=e,this._rctx=t,this.width=null,this.height=null}return e.prototype.enable=function(){if(!this.getEnableState()){var e=this._rctx;this._enabled=!0;var t=e.extensions.depthTexture?4:3;this.framebuffer=a.createWithAttachments(e,c,{colorTarget:0,depthStencilTarget:t}),this.quadVAO=this.createQuadVAO(e)}},e.prototype.disable=function(){this.getEnableState()&&(this._enabled=!1,this.framebuffer.dispose(),this.quadVAO.dispose(!0),this.framebuffer=null,this.quadVAO=null,this._depthStencilTextureCached=null)},e.prototype.createQuadVAO=function(e){var t=new Float32Array([-1,-1,-1,-1,1,-1,1,-1,-1,1,-1,1,1,1,1,1]);return new u(e,d.Default3D,{geometry:l.Pos2Tex},{geometry:s.createVertex(e,35044,t)})},e.prototype.setEnableState=function(e){e?this.enable():this.disable()},e.prototype.getEnableState=function(){return this._enabled},e.prototype.getColorTexture=function(){return this.framebuffer.colorTexture},e.prototype.getDepthTexture=function(){return e.supportsDepthTexture(this._rctx.extensions)?this.framebuffer.depthStencilTexture||this._depthStencilTextureCached:null},e.prototype.getHUDVisibilityTexture=function(){return this._hudVisibilityTexture},e.supportsDepthTexture=function(e){return!!e.depthTexture},e.prototype.initializeFrame=function(e){r.assert(this.getEnableState());var t=this._rctx,i=t.gl,a=e.fullViewport;this.width=a[2],this.height=a[3],this.framebuffer.resize(this.width,this.height),t.bindFramebuffer(this.framebuffer),t.setClearStencil(0),t.setClearColor(0,0,0,1),t.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT|i.STENCIL_BUFFER_BIT)},e.prototype.renderHUDVisibility=function(e){var t=this._rctx,r=t.gl;this._hudVisibilityTexture||(this._hudVisibilityTexture=new h(t,p)),this._hudVisibilityTexture.resize(this.width,this.height);var i=this.framebuffer.detachColorTexture();this.framebuffer.attachColorTexture(this._hudVisibilityTexture),t.bindFramebuffer(this.framebuffer),t.setClearColor(0,0,0,1),t.clear(r.COLOR_BUFFER_BIT),e(),r.flush(),this.framebuffer.detachColorTexture(),this.framebuffer.attachColorTexture(i)},e.prototype.bindFramebuffer=function(){this._rctx.bindFramebuffer(this.framebuffer)},e.prototype.getFramebuffer=function(){return this.framebuffer},e.prototype.detachDepthTextureFromBuffer=function(){this._depthStencilTextureCached=this.framebuffer.depthStencilTexture,this.framebuffer.detachDepthStencilTexture()},e.prototype.restoreDepthTextureToBuffer=function(){this.framebuffer.attachDepthStencilTexture(this._depthStencilTextureCached),this._depthStencilTextureCached=null},e.prototype.drawQuad=function(e){r.assert(this.getEnableState());var t=this._rctx,i=t.gl,a=this._programRep.get("offscreenProgram");t.bindFramebuffer(),t.setDepthTestEnabled(!1),t.clear(i.COLOR_BUFFER_BIT),t.bindProgram(a),a.setUniform1i("tex",1),t.bindTexture(this.framebuffer.colorTexture,1),t.bindVAO(this.quadVAO),t.drawArrays(5,0,f.vertexCount(this.quadVAO,"geometry")),t.setDepthTestEnabled(!0)},e.loadShaders=function(e,t,r,a){e._parse(i);var h=new n(a,e.vsOffscreenRenderer,e.fsOffscreenRenderer,d.Default3D);r.add("offscreenProgram",h)},e}();return b});