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

define(["require","exports","../../../core/tsSupport/extendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","../../../core/ObjectPool","../../../core/Error","../../../core/promiseUtils","./LayerView2D","../tiling/TileInfoView","../tiling/TileKey","../tiling/TileQueue","../tiling/TileStrategy","../engine/Bitmap","../engine/BitmapSource","../engine/BitmapContainer","../engine/Canvas2DContainer","../engine/Tiled","../../layers/RefreshableLayerView"],function(e,t,i,n,r,o,s,l,u,a,h,c,f,p,y,d,g,_,w){var v=function(e){function t(t){var i=e.call(this,t)||this;return i.key=new h(0,0,0,0),i}return i(t,e),t.prototype.acquire=function(e){},t.prototype.release=function(){this.key.set(0,0,0,0)},t.pool=new o(t,!0),t}(_(p)),T=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._tileStrategy=null,t._tileInfoView=null,t._fetchQueue=null,t._tileRequests=new Map,t.container=new g,t.layer=null,t}return i(t,e),t.prototype.initialize=function(){var e,t=this.layer.tileInfo,i=t&&t.spatialReference;i||(e=new s("layerview:tiling-information-missing","The layer doesn't provide tiling information",{layer:this.layer})),i.equals(this.view.spatialReference)||(e=new s("layerview:spatial-reference-incompatible","The spatial reference of this layer does not meet the requirements of the view",{layer:this.layer})),e&&this.addResolvingPromise(l.reject(e))},t.prototype.hitTest=function(e,t){return null},t.prototype.update=function(e){this._fetchQueue.pause(),this._fetchQueue.state=e.state,this._tileStrategy.update(e),this._fetchQueue.resume(),this.notifyChange("updating")},t.prototype.attach=function(){var e=this;this._tileContainer=new d,this.container.addChild(this._tileContainer),this._tileInfoView=new a(this.layer.tileInfo,this.layer.fullExtent),this._fetchQueue=new c({tileInfoView:this._tileInfoView,process:function(t){return e.fetchTile(t)}}),this._tileStrategy=new f({cachePolicy:"keep",acquireTile:function(t){return e.acquireTile(t)},releaseTile:function(t){return e.releaseTile(t)},tileInfoView:this._tileInfoView})},t.prototype.detach=function(){this._tileStrategy.destroy(),this._fetchQueue.clear(),this.container.removeChild(this._tileContainer),this._fetchQueue=this._tileStrategy=this._tileInfoView=this._tileContainer=null},t.prototype.moveStart=function(){this.requestUpdate()},t.prototype.viewChange=function(){this.requestUpdate()},t.prototype.moveEnd=function(){this.requestUpdate()},t.prototype.doRefresh=function(){var e=this;this.updateRequested||this.suspended||(this._fetchQueue.reset(),this._tileStrategy.tiles.forEach(function(t){return e._enqueueTileFetch(t)}),this.notifyChange("updating"))},t.prototype.isUpdating=function(){var e=!0;return this._tileRequests.forEach(function(t){e=e&&t.isFulfilled()}),!e},t.prototype.getTileBounds=function(e,t){return this._tileStrategy.tileInfoView.getTileBounds(e,t)},t.prototype.getTileCoords=function(e,t){return this._tileStrategy.tileInfoView.getTileCoords(e,t)},t.prototype.getTileResolution=function(e){return this._tileStrategy.tileInfoView.getTileResolution(e)},t.prototype.acquireTile=function(e){var t=v.pool.acquire();return t.key.set(e),this._tileInfoView.getTileCoords(t.coords,t.key),t.resolution=this._tileInfoView.getTileResolution(t.key),i=this._tileInfoView.tileInfo.size,t.width=i[0],t.height=i[1],this._enqueueTileFetch(t),this.requestUpdate(),t;var i},t.prototype.releaseTile=function(e){var t=this,i=this._tileRequests.get(e);i&&!i.isFulfilled()&&i.cancel(),this._tileRequests["delete"](e),this._tileContainer.removeChild(e),e.once("detach",function(){v.pool.release(e),t.requestUpdate()}),this.requestUpdate()},t.prototype.fetchTile=function(e){var t=this,i=this.layer.tilemapCache;if(i){var n=e.level,r=e.row,o=e.col;return i.fetchAvailabilityUpsample(n,r,o,e).then(function(){return t._fetchImage(e)}).otherwise(function(){return e.level=n,e.row=r,e.col=o,t._fetchImage(e)})}return this._fetchImage(e)},t.prototype._enqueueTileFetch=function(e){var t=this;if(!this._fetchQueue.has(e.key)){var i=this._fetchQueue.push(e.key).then(function(i){e.source=i,e.once("attach",function(){return t.requestUpdate()}),t._tileContainer.addChild(e),t.requestUpdate()});this._tileRequests.set(e,i)}},t.prototype._fetchImage=function(e){var t=this,i=this.layer.fetchTile(e.level,e.row,e.col,{timestamp:this.refreshTimestamp}).then(function(i){var n=y.pool.acquire(i);return n.coords=t.getTileCoords(n.coords,e),n.resolution=t.getTileResolution(e),n});return i},t=n([r.subclass("esri.views.2d.layers.TiledLayerView2D")],t)}(r.declared(u,w));return T});