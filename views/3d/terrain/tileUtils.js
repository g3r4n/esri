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

define(["require","exports","./UpsampleInfo","../support/PreallocArray"],function(t,r,e,n){function i(t,r,e){return t+"/"+r+"/"+e}function l(t){return t.lij[0]+"/"+t.lij[1]+"/"+t.lij[2]}function s(t,r,e,n){if(Array.isArray(t))for(var i=0;i<t.length;i++)a(t[i],r,e,n);else a(t,r,e,n)}function a(t,r,e,n){n=r.call(e,t,n);for(var i=0;4>i;i++){var l=t.children[i];l&&a(l,r,e,n)}}function o(t,r,e){if(Array.isArray(t))for(var n=0;n<t.length;n++)h(t[n],r,e);else h(t,r,e)}function h(t,r,e){for(var n=0;4>n;n++){var i=t.children[n];i&&o(i,r,e)}r.call(e,t)}function u(t,r,e){if(!r)return!1;var n=r.fullExtent,i=t.extent;if(e){if(i[0]<n.xmin||i[1]<n.ymin||i[2]>n.xmax||i[3]>n.ymax)return!1}else if(n.xmin>i[2]||n.ymin>i[3]||n.xmax<i[0]||n.ymax<i[1])return!1;var l=t.parentSurface.tilingScheme.levels[t.lij[0]].scale;return r.minScale>0&&l>1.00000001*r.minScale?!1:r.maxScale>0&&l<.99999999*r.maxScale?!1:!0}function f(t,r){var e=t.extent;return r[0]>=e[0]&&r[1]>=e[1]&&r[0]<=e[2]&&r[1]<=e[3]}function c(t,r){for(;r>0;)t=t.parent,r--;return t}function v(t,r){var e=t.lij[0]-r.lij[0]-1,n=t.lij[1]>>e,i=t.lij[2]>>e,l=0;return 1&n&&(l+=2),1&i&&(l+=1),r.children[l]}function p(t,r){for(var n=1,i=0,l=0;t!==r;)if(n*=.5,i*=.5,l*=.5,1&t.lij[2]&&(i+=.5),0===(1&t.lij[1])&&(l+=.5),t=t.parent,null==t)throw new Error("tile was not a descendant of ancestorTile");var s=e.Pool.acquire();return s.init(r,i,l,n),s}function d(t){var r;Array.isArray(t)?r=t:(x[0]=t,r=x);for(var e=0;e<r.length;e++){var n=r[e],i=n.parent;if(i)for(var l=0;4>l;l++){var s=i.children[l];if(s&&s!==n&&s.visible)return!0}}return!1}Object.defineProperty(r,"__esModule",{value:!0});var q=function(){function t(t){void 0===t&&(t=100),this.q=new n(t),this._last=null,this.done=!0}return t.prototype.reset=function(t){this.q.clear(),t&&this.q.pushEither(t),this._last=null,this.done=0===this.q.length},t.prototype.skip=function(){this._last=null,0===this.q.length&&(this.done=!0)},t.prototype.next=function(){if(this.done)return null;if(null!==this._last){var t=this._last.children;if(t[0])for(var r=4;r>=0;r--){var e=t[r];e&&this.q.push(e)}this._last=null}return this._last=this.q.pop(),0!==this.q.length||this._last.children[0]||(this.done=!0),this._last},t}();r.IteratorPreorder=q;var y=function(){function t(t){void 0===t&&(t=100),this.q=new n(t),this.done=!0}return t.prototype.reset=function(t){this.q.clear(),this.q.pushEither(t);for(var r=0;r<this.q.length;)for(var e=this.q.data[r++],n=0;4>n;n++){var i=e.children[n];i&&this.q.push(i)}this.done=0===this.q.length},t.prototype.next=function(){var t=this.q.pop();return this.done=0===this.q.length,t},t}();r.IteratorPostorder=y,r.lij2str=i,r.tile2str=l,r.traverseTilesPreorder=s,r.traverseTilesPostorder=o,r.fallsWithinLayer=u,r.isPosWithinTile=f,r.getTileNLevelsUp=c,r.nextTileInAncestry=v,r.computeUpsampleInfoForAncestor=p;var x=[null];r.hasVisibleSiblings=d});