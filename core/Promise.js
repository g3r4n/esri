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

define(["dojo/_base/lang","dojo/promise/all","dojo/Deferred","dojo/aspect","dojo/has","dojo/errors/create","./Scheduler","./Logger","./declare"],function(e,r,i,s,n,o,t,l,c){function a(e,r){p.warn("DEPRECATED: "+e+"()"+(r?" -- use "+r+" instead":""))}n.add("esri-promise-compatibility",!1),n.add("esri-promise-compatibility-deprecation-warnings",!0);var p=l.getLogger("esri.core.Promise"),u=function(e){var s=e._promiseProps;if(!s.resolver.isFulfilled()){var n,o,l=s.resolvingPromises;s.allPromise&&s.allPromise.cancel();var c=new i;for(n=l.length-1;n>=0;n--)o=l[n],o.isCanceled&&o.isCanceled()?l.splice(n,1):o.then(null,null,s.resolver.progress);o=null;var a=s.allPromise=r(l.concat([c.promise]));a.then(function(){s.resolver.resolve(e),e=s=c=s.allPromise=s.resolvingPromises=null},function(r){if(s.allPromise=null,!r||"cancel"!==r.dojoType){var i=Array.prototype.slice.call(arguments,0);s.resolver.reject(i[0]),e=s=c=s.allPromise=s.resolvingPromises=null}}),c&&t.schedule(function(){c&&c.resolve()})}},h=o("CancelError",null,function(e){this.target=e}),m=function(e){return e||new h(this.instance)},d=function(e){this.instance=e,this.canceler=m.bind(this),this.resolver=new i,this.initialized=!1,this.resolvingPromises=[]};d.prototype={canceler:null,cancel:function(e){if(!this.resolver.isFulfilled()){this.allPromise.cancel();for(var r=this.resolvingPromises.concat(),i=r.length-1;i>=0;i--)r[i].cancel(e);this.resolver.cancel(e)}}};var f={declaredClass:"esri.core.Promise",constructor:function(){Object.defineProperty(this,"_promiseProps",{value:new d(this),enumerable:!1,configurable:!1,writable:!0});var e=s.after(this,"postscript",function(r,i){e.remove(),e=null,u(this)},!0)},_promiseProps:null,always:function(e){return n("esri-promise-compatibility-deprecation-warnings")&&a("always",".when(callback).catch(errBack)"),this.when(e,e)},isResolved:function(){return this._promiseProps.resolver.isResolved()},isRejected:function(){return this._promiseProps.resolver.isRejected()},isFulfilled:function(){return this._promiseProps.resolver.isFulfilled()},otherwise:function(e){return n("esri-promise-compatibility-deprecation-warnings")&&a("otherwise",".when().catch(errback)"),this.when(null,e)},"catch":function(e){return n("esri-promise-compatibility-deprecation-warnings")&&a("catch",".when().catch(errback)"),this.when(null,e)},when:function(e,r,s){var n=new i(this._promiseProps.canceler),o=n.then(e,r,s);return this._promiseProps.resolver.then(n.resolve,n.reject,n.progress),o},addResolvingPromise:function(e){e&&!this._promiseProps.resolver.isFulfilled()&&(e._promiseProps&&(e=e.when()),this._promiseProps.resolvingPromises.push(e),u(this))}};n("esri-promise-compatibility")||(f=e.mixin(f,{then:function(e,r,i){return n("esri-promise-compatibility-deprecation-warnings")&&a("then",".when(callback, errback)"),this.when(e,r,i)},cancel:function(){n("esri-promise-compatibility-deprecation-warnings")&&a("cancel")},isCanceled:function(){return n("esri-promise-compatibility-deprecation-warnings")&&a("isCanceled"),!1},trace:function(){return n("esri-promise-compatibility-deprecation-warnings")&&a("trace"),this},traceRejected:function(){return n("esri-promise-compatibility-deprecation-warnings")&&a("traceRejected"),this}}));var v=c(null,f);return v});