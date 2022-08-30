(function (console, $global) { "use strict";
let $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; let proto = new Inherit();
	for (let name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
let EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		let tmp;
		if(this.r.m != null && n >= 0 && n < this.r.m.length) tmp = this.r.m[n]; else throw new js__$Boot_FluidError("EReg::matched");
		return tmp;
	}
	,matchedRight: function() {
		if(this.r.m == null) throw new js__$Boot_FluidError("No string matched");
		let sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_FluidError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
let GPUCapabilities = function() { };
$hxClasses["GPUCapabilities"] = GPUCapabilities;
GPUCapabilities.__name__ = true;
GPUCapabilities.get_writeToFloat = function() {
	if(GPUCapabilities.get_extTextureFloat() == null) return false;
	let texture = gltoolbox_TextureTools.createTexture(2,2,{ channelType : 6408, dataType : 5126, filter : 9728, wrapS : 33071, wrapT : 33071, unpackAlignment : 4});
	let framebuffer = flu_modules_opengl_web_GL.current_context.createFramebuffer();
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,framebuffer);
	flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,texture,0);
	let isValid = flu_modules_opengl_web_GL.current_context.checkFramebufferStatus(36160) == 36053;
	flu_modules_opengl_web_GL.current_context.deleteTexture(texture);
	flu_modules_opengl_web_GL.current_context.deleteFramebuffer(framebuffer);
	flu_modules_opengl_web_GL.current_context.bindTexture(3553,null);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,null);
	return isValid;
};
GPUCapabilities.get_writeToHalfFloat = function() {
	if(GPUCapabilities.get_extTextureHalfFloat() == null) return false;
	let texture = gltoolbox_TextureTools.createTexture(2,2,{ channelType : 6408, dataType : GPUCapabilities.get_HALF_FLOAT(), filter : 9728, wrapS : 33071, wrapT : 33071, unpackAlignment : 4});
	let framebuffer = flu_modules_opengl_web_GL.current_context.createFramebuffer();
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,framebuffer);
	flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,texture,0);
	let isValid = flu_modules_opengl_web_GL.current_context.checkFramebufferStatus(36160) == 36053;
	flu_modules_opengl_web_GL.current_context.deleteTexture(texture);
	flu_modules_opengl_web_GL.current_context.deleteFramebuffer(framebuffer);
	flu_modules_opengl_web_GL.current_context.bindTexture(3553,null);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,null);
	return isValid;
};
GPUCapabilities.get_floatTextureLinear = function() {
	if(GPUCapabilities._floatTextureLinear == null) GPUCapabilities._floatTextureLinear = GPUCapabilities.get_extTextureFloatLinear() != null;
	return GPUCapabilities._floatTextureLinear;
};
GPUCapabilities.get_halfFloatTextureLinear = function() {
	if(GPUCapabilities._halfFloatTextureLinear == null) GPUCapabilities._halfFloatTextureLinear = GPUCapabilities.get_extTextureHalfFloatLinear() != null;
	return GPUCapabilities._halfFloatTextureLinear;
};
GPUCapabilities.get_HALF_FLOAT = function() {
	if(GPUCapabilities._HALF_FLOAT == null) {
		let ext = GPUCapabilities.get_extTextureHalfFloat();
		if(ext != null) GPUCapabilities._HALF_FLOAT = ext.HALF_FLOAT_OES; else GPUCapabilities._HALF_FLOAT = 36193;
	}
	return GPUCapabilities._HALF_FLOAT;
};
GPUCapabilities.get_extTextureFloat = function() {
	if(GPUCapabilities._extTextureFloat == null) GPUCapabilities._extTextureFloat = flu_modules_opengl_web_GL.current_context.getExtension("OES_texture_float");
	return GPUCapabilities._extTextureFloat;
};
GPUCapabilities.get_extTextureHalfFloat = function() {
	if(GPUCapabilities._extTextureHalfFloat == null) GPUCapabilities._extTextureHalfFloat = flu_modules_opengl_web_GL.current_context.getExtension("OES_texture_half_float");
	return GPUCapabilities._extTextureHalfFloat;
};
GPUCapabilities.get_extTextureFloatLinear = function() {
	if(GPUCapabilities._extTextureFloatLinear == null) GPUCapabilities._extTextureFloatLinear = flu_modules_opengl_web_GL.current_context.getExtension("OES_texture_float_linear");
	return GPUCapabilities._extTextureFloatLinear;
};
GPUCapabilities.get_extTextureHalfFloatLinear = function() {
	if(GPUCapabilities._extTextureHalfFloatLinear == null) GPUCapabilities._extTextureHalfFloatLinear = flu_modules_opengl_web_GL.current_context.getExtension("OES_texture_half_float_linear");
	return GPUCapabilities._extTextureHalfFloatLinear;
};
let GPUFluid = function(width,height,cellSize,solverIterations) {
	if(solverIterations == null) solverIterations = 18;
	if(cellSize == null) cellSize = 8;
	this.clearPressureShader = new ClearPressure();
	this.clearVelocityShader = new ClearVelocity();
	this.pressureGradientSubstractShader = new PressureGradientSubstract();
	this.pressureSolveShader = new PressureSolve();
	this.divergenceShader = new Divergence();
	this.advectVelocityShader = new AdvectVelocity();
	this.advectShader = new Advect();
	this.floatDye = false;
	this.floatDivergence = false;
	this.floatPressure = false;
	this.floatVelocity = false;
	this.width = width;
	this.height = height;
	this.solverIterations = solverIterations;
	this.aspectRatio = this.width / this.height;
	this.cellSize = cellSize;
	let _this = this.advectShader.rdx;
	_this.dirty = true;
	_this.data = 1 / this.cellSize;
	let _this1 = this.advectVelocityShader.rdx;
	_this1.dirty = true;
	_this1.data = 1 / this.cellSize;
	let _this2 = this.divergenceShader.halfrdx;
	_this2.dirty = true;
	_this2.data = 0.5 * (1 / this.cellSize);
	let _this3 = this.pressureGradientSubstractShader.halfrdx;
	_this3.dirty = true;
	_this3.data = 0.5 * (1 / this.cellSize);
	let _this4 = this.pressureSolveShader.alpha;
	_this4.dirty = true;
	_this4.data = -this.cellSize * this.cellSize;
	this.textureQuad = gltoolbox_GeometryTools.getCachedUnitQuad();
	let floatDataType = null;
	if(GPUCapabilities.get_writeToFloat()) {
		floatDataType = 5126;
		GPUCapabilities.get_floatTextureLinear();
	} else if(GPUCapabilities.get_writeToHalfFloat()) {
		floatDataType = GPUCapabilities.get_HALF_FLOAT();
		GPUCapabilities.get_halfFloatTextureLinear();
	}
	this.floatVelocity = this.floatPressure = this.floatDivergence = floatDataType != null;
	this.floatDye = false;
	let tmp;
	let params = { channelType : 6408, dataType : this.floatVelocity?floatDataType:5121, filter : 9728};
	tmp = function(width1,height1) {
		return gltoolbox_TextureTools.createTexture(width1,height1,params);
	};
	this.velocityRenderTarget = new gltoolbox_render_RenderTarget2Phase(width,height,tmp);
	let tmp1;
	let params1 = { channelType : 6407, dataType : this.floatPressure?floatDataType:5121, filter : 9728};
	tmp1 = function(width2,height2) {
		return gltoolbox_TextureTools.createTexture(width2,height2,params1);
	};
	this.pressureRenderTarget = new gltoolbox_render_RenderTarget2Phase(width,height,tmp1);
	let tmp2;
	let params2 = { channelType : 6407, dataType : this.floatDivergence?floatDataType:5121, filter : 9728};
	tmp2 = function(width3,height3) {
		return gltoolbox_TextureTools.createTexture(width3,height3,params2);
	};
	this.divergenceRenderTarget = new gltoolbox_render_RenderTarget(width,height,tmp2);
	let tmp3;
	let params3 = { channelType : 6407, dataType : this.floatDye?floatDataType:5121, filter : 9729};
	tmp3 = function(width4,height4) {
		return gltoolbox_TextureTools.createTexture(width4,height4,params3);
	};
	this.dyeRenderTarget = new gltoolbox_render_RenderTarget2Phase(width,height,tmp3);
	this.updateAllCoreShaderUniforms();
	flu_modules_opengl_web_GL.current_context.viewport(0,0,this.width,this.height);
	flu_modules_opengl_web_GL.current_context.disable(3042);
	flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
	let shader = this.clearVelocityShader;
	if(shader._active) {
		let _g = 0;
		let _g1 = shader._uniforms;
		while(_g < _g1.length) {
			let u = _g1[_g];
			++_g;
			u.apply();
		}
		let offset = 0;
		let _g11 = 0;
		let _g2 = shader._attributes.length;
		while(_g11 < _g2) {
			let i = _g11++;
			let att = shader._attributes[i];
			let location = att.location;
			if(location != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
			}
			offset += att.byteSize;
		}
	} else {
		if(!shader._ready) shader.create();
		flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
		let _g3 = 0;
		let _g12 = shader._uniforms;
		while(_g3 < _g12.length) {
			let u1 = _g12[_g3];
			++_g3;
			u1.apply();
		}
		let offset1 = 0;
		let _g13 = 0;
		let _g4 = shader._attributes.length;
		while(_g13 < _g4) {
			let i1 = _g13++;
			let att1 = shader._attributes[i1];
			let location1 = att1.location;
			if(location1 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
			}
			offset1 += att1.byteSize;
		}
		shader._active = true;
	}
	this.velocityRenderTarget.activate();
	flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
	shader.deactivate();
	let _this5 = this.velocityRenderTarget;
	_this5.tmpFBO = _this5.writeFrameBufferObject;
	_this5.writeFrameBufferObject = _this5.readFrameBufferObject;
	_this5.readFrameBufferObject = _this5.tmpFBO;
	_this5.tmpTex = _this5.writeToTexture;
	_this5.writeToTexture = _this5.readFromTexture;
	_this5.readFromTexture = _this5.tmpTex;
	let shader1 = this.clearPressureShader;
	if(shader1._active) {
		let _g5 = 0;
		let _g14 = shader1._uniforms;
		while(_g5 < _g14.length) {
			let u2 = _g14[_g5];
			++_g5;
			u2.apply();
		}
		let offset2 = 0;
		let _g15 = 0;
		let _g6 = shader1._attributes.length;
		while(_g15 < _g6) {
			let i2 = _g15++;
			let att2 = shader1._attributes[i2];
			let location2 = att2.location;
			if(location2 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
			}
			offset2 += att2.byteSize;
		}
	} else {
		if(!shader1._ready) shader1.create();
		flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
		let _g7 = 0;
		let _g16 = shader1._uniforms;
		while(_g7 < _g16.length) {
			let u3 = _g16[_g7];
			++_g7;
			u3.apply();
		}
		let offset3 = 0;
		let _g17 = 0;
		let _g8 = shader1._attributes.length;
		while(_g17 < _g8) {
			let i3 = _g17++;
			let att3 = shader1._attributes[i3];
			let location3 = att3.location;
			if(location3 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
			}
			offset3 += att3.byteSize;
		}
		shader1._active = true;
	}
	this.pressureRenderTarget.activate();
	flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
	shader1.deactivate();
	let _this6 = this.pressureRenderTarget;
	_this6.tmpFBO = _this6.writeFrameBufferObject;
	_this6.writeFrameBufferObject = _this6.readFrameBufferObject;
	_this6.readFrameBufferObject = _this6.tmpFBO;
	_this6.tmpTex = _this6.writeToTexture;
	_this6.writeToTexture = _this6.readFromTexture;
	_this6.readFromTexture = _this6.tmpTex;
	let _this7 = this.dyeRenderTarget;
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this7.readFrameBufferObject);
	flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
	flu_modules_opengl_web_GL.current_context.clear(16384);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this7.writeFrameBufferObject);
	flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
	flu_modules_opengl_web_GL.current_context.clear(16384);
};
$hxClasses["GPUFluid"] = GPUFluid;
GPUFluid.__name__ = true;
GPUFluid.prototype = {
	updateAllCoreShaderUniforms: function() {
		let shader = this.advectShader;
		if(shader == null) {
		} else {
			let _this = shader.aspectRatio;
			_this.dirty = true;
			_this.data = this.aspectRatio;
			shader.invresolution.data.x = 1 / this.width;
			shader.invresolution.data.y = 1 / this.height;
			let v;
			v = this.floatVelocity?"true":"false";
			if(shader.FLOAT_VELOCITY != v) shader.set_FLOAT_VELOCITY(v);
			v = this.floatPressure?"true":"false";
			if(shader.FLOAT_PRESSURE != v) shader.set_FLOAT_PRESSURE(v);
			v = this.floatDivergence?"true":"false";
			if(shader.FLOAT_DIVERGENCE != v) shader.set_FLOAT_DIVERGENCE(v);
		}
		let shader1 = this.advectVelocityShader;
		if(shader1 == null) {
		} else {
			let _this1 = shader1.aspectRatio;
			_this1.dirty = true;
			_this1.data = this.aspectRatio;
			shader1.invresolution.data.x = 1 / this.width;
			shader1.invresolution.data.y = 1 / this.height;
			let v1;
			v1 = this.floatVelocity?"true":"false";
			if(shader1.FLOAT_VELOCITY != v1) shader1.set_FLOAT_VELOCITY(v1);
			v1 = this.floatPressure?"true":"false";
			if(shader1.FLOAT_PRESSURE != v1) shader1.set_FLOAT_PRESSURE(v1);
			v1 = this.floatDivergence?"true":"false";
			if(shader1.FLOAT_DIVERGENCE != v1) shader1.set_FLOAT_DIVERGENCE(v1);
		}
		let shader2 = this.divergenceShader;
		if(shader2 == null) {
		} else {
			let _this2 = shader2.aspectRatio;
			_this2.dirty = true;
			_this2.data = this.aspectRatio;
			shader2.invresolution.data.x = 1 / this.width;
			shader2.invresolution.data.y = 1 / this.height;
			let v2;
			v2 = this.floatVelocity?"true":"false";
			if(shader2.FLOAT_VELOCITY != v2) shader2.set_FLOAT_VELOCITY(v2);
			v2 = this.floatPressure?"true":"false";
			if(shader2.FLOAT_PRESSURE != v2) shader2.set_FLOAT_PRESSURE(v2);
			v2 = this.floatDivergence?"true":"false";
			if(shader2.FLOAT_DIVERGENCE != v2) shader2.set_FLOAT_DIVERGENCE(v2);
		}
		let shader3 = this.pressureSolveShader;
		if(shader3 == null) {
		} else {
			let _this3 = shader3.aspectRatio;
			_this3.dirty = true;
			_this3.data = this.aspectRatio;
			shader3.invresolution.data.x = 1 / this.width;
			shader3.invresolution.data.y = 1 / this.height;
			let v3;
			v3 = this.floatVelocity?"true":"false";
			if(shader3.FLOAT_VELOCITY != v3) shader3.set_FLOAT_VELOCITY(v3);
			v3 = this.floatPressure?"true":"false";
			if(shader3.FLOAT_PRESSURE != v3) shader3.set_FLOAT_PRESSURE(v3);
			v3 = this.floatDivergence?"true":"false";
			if(shader3.FLOAT_DIVERGENCE != v3) shader3.set_FLOAT_DIVERGENCE(v3);
		}
		let shader4 = this.pressureGradientSubstractShader;
		if(shader4 == null) {
		} else {
			let _this4 = shader4.aspectRatio;
			_this4.dirty = true;
			_this4.data = this.aspectRatio;
			shader4.invresolution.data.x = 1 / this.width;
			shader4.invresolution.data.y = 1 / this.height;
			let v4;
			v4 = this.floatVelocity?"true":"false";
			if(shader4.FLOAT_VELOCITY != v4) shader4.set_FLOAT_VELOCITY(v4);
			v4 = this.floatPressure?"true":"false";
			if(shader4.FLOAT_PRESSURE != v4) shader4.set_FLOAT_PRESSURE(v4);
			v4 = this.floatDivergence?"true":"false";
			if(shader4.FLOAT_DIVERGENCE != v4) shader4.set_FLOAT_DIVERGENCE(v4);
		}
		let shader5 = this.clearVelocityShader;
		if(shader5 == null) {
		} else {
			let _this5 = shader5.aspectRatio;
			_this5.dirty = true;
			_this5.data = this.aspectRatio;
			shader5.invresolution.data.x = 1 / this.width;
			shader5.invresolution.data.y = 1 / this.height;
			let v5;
			v5 = this.floatVelocity?"true":"false";
			if(shader5.FLOAT_VELOCITY != v5) shader5.set_FLOAT_VELOCITY(v5);
			v5 = this.floatPressure?"true":"false";
			if(shader5.FLOAT_PRESSURE != v5) shader5.set_FLOAT_PRESSURE(v5);
			v5 = this.floatDivergence?"true":"false";
			if(shader5.FLOAT_DIVERGENCE != v5) shader5.set_FLOAT_DIVERGENCE(v5);
		}
		let shader6 = this.clearPressureShader;
		if(shader6 == null) {
		} else {
			let _this6 = shader6.aspectRatio;
			_this6.dirty = true;
			_this6.data = this.aspectRatio;
			shader6.invresolution.data.x = 1 / this.width;
			shader6.invresolution.data.y = 1 / this.height;
			let v6;
			v6 = this.floatVelocity?"true":"false";
			if(shader6.FLOAT_VELOCITY != v6) shader6.set_FLOAT_VELOCITY(v6);
			v6 = this.floatPressure?"true":"false";
			if(shader6.FLOAT_PRESSURE != v6) shader6.set_FLOAT_PRESSURE(v6);
			v6 = this.floatDivergence?"true":"false";
			if(shader6.FLOAT_DIVERGENCE != v6) shader6.set_FLOAT_DIVERGENCE(v6);
		}
		let shader7 = this.applyForcesShader;
		if(shader7 == null) {
		} else {
			let _this7 = shader7.aspectRatio;
			_this7.dirty = true;
			_this7.data = this.aspectRatio;
			shader7.invresolution.data.x = 1 / this.width;
			shader7.invresolution.data.y = 1 / this.height;
			let v7;
			v7 = this.floatVelocity?"true":"false";
			if(shader7.FLOAT_VELOCITY != v7) shader7.set_FLOAT_VELOCITY(v7);
			v7 = this.floatPressure?"true":"false";
			if(shader7.FLOAT_PRESSURE != v7) shader7.set_FLOAT_PRESSURE(v7);
			v7 = this.floatDivergence?"true":"false";
			if(shader7.FLOAT_DIVERGENCE != v7) shader7.set_FLOAT_DIVERGENCE(v7);
		}
		let shader8 = this.updateDyeShader;
		if(shader8 == null) {
		} else {
			let _this8 = shader8.aspectRatio;
			_this8.dirty = true;
			_this8.data = this.aspectRatio;
			shader8.invresolution.data.x = 1 / this.width;
			shader8.invresolution.data.y = 1 / this.height;
			let v8;
			v8 = this.floatVelocity?"true":"false";
			if(shader8.FLOAT_VELOCITY != v8) shader8.set_FLOAT_VELOCITY(v8);
			v8 = this.floatPressure?"true":"false";
			if(shader8.FLOAT_PRESSURE != v8) shader8.set_FLOAT_PRESSURE(v8);
			v8 = this.floatDivergence?"true":"false";
			if(shader8.FLOAT_DIVERGENCE != v8) shader8.set_FLOAT_DIVERGENCE(v8);
		}
	}
	,step: function(dt) {
		flu_modules_opengl_web_GL.current_context.viewport(0,0,this.width,this.height);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
		let _this = this.advectVelocityShader.dt;
		_this.dirty = true;
		_this.data = dt;
		let _this1 = this.advectVelocityShader.velocity;
		_this1.dirty = true;
		_this1.data = this.velocityRenderTarget.readFromTexture;
		let shader = this.advectVelocityShader;
		if(shader._active) {
			let _g = 0;
			let _g1 = shader._uniforms;
			while(_g < _g1.length) {
				let u = _g1[_g];
				++_g;
				u.apply();
			}
			let offset = 0;
			let _g11 = 0;
			let _g2 = shader._attributes.length;
			while(_g11 < _g2) {
				let i = _g11++;
				let att = shader._attributes[i];
				let location = att.location;
				if(location != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
				}
				offset += att.byteSize;
			}
		} else {
			if(!shader._ready) shader.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
			let _g3 = 0;
			let _g12 = shader._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = shader._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = shader._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
			shader._active = true;
		}
		this.velocityRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader.deactivate();
		let _this2 = this.velocityRenderTarget;
		_this2.tmpFBO = _this2.writeFrameBufferObject;
		_this2.writeFrameBufferObject = _this2.readFrameBufferObject;
		_this2.readFrameBufferObject = _this2.tmpFBO;
		_this2.tmpTex = _this2.writeToTexture;
		_this2.writeToTexture = _this2.readFromTexture;
		_this2.readFromTexture = _this2.tmpTex;
		if(this.applyForcesShader == null) {
		} else {
			let _this3 = this.applyForcesShader.dt;
			_this3.dirty = true;
			_this3.data = dt;
			let _this4 = this.applyForcesShader.velocity;
			_this4.dirty = true;
			_this4.data = this.velocityRenderTarget.readFromTexture;
			let shader1 = this.applyForcesShader;
			if(shader1._active) {
				let _g5 = 0;
				let _g14 = shader1._uniforms;
				while(_g5 < _g14.length) {
					let u2 = _g14[_g5];
					++_g5;
					u2.apply();
				}
				let offset2 = 0;
				let _g15 = 0;
				let _g6 = shader1._attributes.length;
				while(_g15 < _g6) {
					let i2 = _g15++;
					let att2 = shader1._attributes[i2];
					let location2 = att2.location;
					if(location2 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
					}
					offset2 += att2.byteSize;
				}
			} else {
				if(!shader1._ready) shader1.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
				let _g7 = 0;
				let _g16 = shader1._uniforms;
				while(_g7 < _g16.length) {
					let u3 = _g16[_g7];
					++_g7;
					u3.apply();
				}
				let offset3 = 0;
				let _g17 = 0;
				let _g8 = shader1._attributes.length;
				while(_g17 < _g8) {
					let i3 = _g17++;
					let att3 = shader1._attributes[i3];
					let location3 = att3.location;
					if(location3 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
					}
					offset3 += att3.byteSize;
				}
				shader1._active = true;
			}
			this.velocityRenderTarget.activate();
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader1.deactivate();
			let _this5 = this.velocityRenderTarget;
			_this5.tmpFBO = _this5.writeFrameBufferObject;
			_this5.writeFrameBufferObject = _this5.readFrameBufferObject;
			_this5.readFrameBufferObject = _this5.tmpFBO;
			_this5.tmpTex = _this5.writeToTexture;
			_this5.writeToTexture = _this5.readFromTexture;
			_this5.readFromTexture = _this5.tmpTex;
		}
		let _this6 = this.divergenceShader.velocity;
		_this6.dirty = true;
		_this6.data = this.velocityRenderTarget.readFromTexture;
		let shader2 = this.divergenceShader;
		if(shader2._active) {
			let _g9 = 0;
			let _g18 = shader2._uniforms;
			while(_g9 < _g18.length) {
				let u4 = _g18[_g9];
				++_g9;
				u4.apply();
			}
			let offset4 = 0;
			let _g19 = 0;
			let _g10 = shader2._attributes.length;
			while(_g19 < _g10) {
				let i4 = _g19++;
				let att4 = shader2._attributes[i4];
				let location4 = att4.location;
				if(location4 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location4);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location4,att4.itemCount,att4.type,false,shader2._aStride,offset4);
				}
				offset4 += att4.byteSize;
			}
		} else {
			if(!shader2._ready) shader2.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader2._prog);
			let _g20 = 0;
			let _g110 = shader2._uniforms;
			while(_g20 < _g110.length) {
				let u5 = _g110[_g20];
				++_g20;
				u5.apply();
			}
			let offset5 = 0;
			let _g111 = 0;
			let _g21 = shader2._attributes.length;
			while(_g111 < _g21) {
				let i5 = _g111++;
				let att5 = shader2._attributes[i5];
				let location5 = att5.location;
				if(location5 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location5);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location5,att5.itemCount,att5.type,false,shader2._aStride,offset5);
				}
				offset5 += att5.byteSize;
			}
			shader2._active = true;
		}
		this.divergenceRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader2.deactivate();
		let _this7 = this.pressureSolveShader.divergence;
		_this7.dirty = true;
		_this7.data = this.divergenceRenderTarget.texture;
		let _this8 = this.pressureSolveShader;
		if(_this8._active) {
			let _g22 = 0;
			let _g112 = _this8._uniforms;
			while(_g22 < _g112.length) {
				let u6 = _g112[_g22];
				++_g22;
				u6.apply();
			}
			let offset6 = 0;
			let _g113 = 0;
			let _g23 = _this8._attributes.length;
			while(_g113 < _g23) {
				let i6 = _g113++;
				let att6 = _this8._attributes[i6];
				let location6 = att6.location;
				if(location6 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location6);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location6,att6.itemCount,att6.type,false,_this8._aStride,offset6);
				}
				offset6 += att6.byteSize;
			}
		} else {
			if(!_this8._ready) _this8.create();
			flu_modules_opengl_web_GL.current_context.useProgram(_this8._prog);
			let _g24 = 0;
			let _g114 = _this8._uniforms;
			while(_g24 < _g114.length) {
				let u7 = _g114[_g24];
				++_g24;
				u7.apply();
			}
			let offset7 = 0;
			let _g115 = 0;
			let _g25 = _this8._attributes.length;
			while(_g115 < _g25) {
				let i7 = _g115++;
				let att7 = _this8._attributes[i7];
				let location7 = att7.location;
				if(location7 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location7);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location7,att7.itemCount,att7.type,false,_this8._aStride,offset7);
				}
				offset7 += att7.byteSize;
			}
			_this8._active = true;
		}
		let _g116 = 0;
		let _g26 = this.solverIterations;
		while(_g116 < _g26) {
			_g116++;
			let _this9 = this.pressureSolveShader.pressure;
			let tmp;
			_this9.dirty = true;
			tmp = _this9.data = this.pressureRenderTarget.readFromTexture;
			let _g27 = 0;
			let _g117 = this.pressureSolveShader._uniforms;
			while(_g27 < _g117.length) {
				let u8 = _g117[_g27];
				++_g27;
				u8.apply();
			}
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.pressureRenderTarget.writeFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			let _this10 = this.pressureRenderTarget;
			_this10.tmpFBO = _this10.writeFrameBufferObject;
			_this10.writeFrameBufferObject = _this10.readFrameBufferObject;
			_this10.readFrameBufferObject = _this10.tmpFBO;
			_this10.tmpTex = _this10.writeToTexture;
			_this10.writeToTexture = _this10.readFromTexture;
			_this10.readFromTexture = _this10.tmpTex;
		}
		this.pressureSolveShader.deactivate();
		let _this11 = this.pressureGradientSubstractShader.pressure;
		_this11.dirty = true;
		_this11.data = this.pressureRenderTarget.readFromTexture;
		let _this12 = this.pressureGradientSubstractShader.velocity;
		_this12.dirty = true;
		_this12.data = this.velocityRenderTarget.readFromTexture;
		let shader3 = this.pressureGradientSubstractShader;
		if(shader3._active) {
			let _g28 = 0;
			let _g118 = shader3._uniforms;
			while(_g28 < _g118.length) {
				let u9 = _g118[_g28];
				++_g28;
				u9.apply();
			}
			let offset8 = 0;
			let _g119 = 0;
			let _g29 = shader3._attributes.length;
			while(_g119 < _g29) {
				let i8 = _g119++;
				let att8 = shader3._attributes[i8];
				let location8 = att8.location;
				if(location8 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location8);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location8,att8.itemCount,att8.type,false,shader3._aStride,offset8);
				}
				offset8 += att8.byteSize;
			}
		} else {
			if(!shader3._ready) shader3.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader3._prog);
			let _g30 = 0;
			let _g120 = shader3._uniforms;
			while(_g30 < _g120.length) {
				let u10 = _g120[_g30];
				++_g30;
				u10.apply();
			}
			let offset9 = 0;
			let _g121 = 0;
			let _g31 = shader3._attributes.length;
			while(_g121 < _g31) {
				let i9 = _g121++;
				let att9 = shader3._attributes[i9];
				let location9 = att9.location;
				if(location9 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location9);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location9,att9.itemCount,att9.type,false,shader3._aStride,offset9);
				}
				offset9 += att9.byteSize;
			}
			shader3._active = true;
		}
		this.velocityRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader3.deactivate();
		let _this13 = this.velocityRenderTarget;
		_this13.tmpFBO = _this13.writeFrameBufferObject;
		_this13.writeFrameBufferObject = _this13.readFrameBufferObject;
		_this13.readFrameBufferObject = _this13.tmpFBO;
		_this13.tmpTex = _this13.writeToTexture;
		_this13.writeToTexture = _this13.readFromTexture;
		_this13.readFromTexture = _this13.tmpTex;
		if(this.updateDyeShader == null) {
		} else {
			let _this14 = this.updateDyeShader.dt;
			_this14.dirty = true;
			_this14.data = dt;
			let _this15 = this.updateDyeShader.dye;
			_this15.dirty = true;
			_this15.data = this.dyeRenderTarget.readFromTexture;
			let shader4 = this.updateDyeShader;
			if(shader4._active) {
				let _g32 = 0;
				let _g122 = shader4._uniforms;
				while(_g32 < _g122.length) {
					let u11 = _g122[_g32];
					++_g32;
					u11.apply();
				}
				let offset10 = 0;
				let _g123 = 0;
				let _g33 = shader4._attributes.length;
				while(_g123 < _g33) {
					let i10 = _g123++;
					let att10 = shader4._attributes[i10];
					let location10 = att10.location;
					if(location10 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location10);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location10,att10.itemCount,att10.type,false,shader4._aStride,offset10);
					}
					offset10 += att10.byteSize;
				}
			} else {
				if(!shader4._ready) shader4.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader4._prog);
				let _g34 = 0;
				let _g124 = shader4._uniforms;
				while(_g34 < _g124.length) {
					let u12 = _g124[_g34];
					++_g34;
					u12.apply();
				}
				let offset11 = 0;
				let _g125 = 0;
				let _g35 = shader4._attributes.length;
				while(_g125 < _g35) {
					let i11 = _g125++;
					let att11 = shader4._attributes[i11];
					let location11 = att11.location;
					if(location11 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location11);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location11,att11.itemCount,att11.type,false,shader4._aStride,offset11);
					}
					offset11 += att11.byteSize;
				}
				shader4._active = true;
			}
			this.dyeRenderTarget.activate();
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader4.deactivate();
			let _this16 = this.dyeRenderTarget;
			_this16.tmpFBO = _this16.writeFrameBufferObject;
			_this16.writeFrameBufferObject = _this16.readFrameBufferObject;
			_this16.readFrameBufferObject = _this16.tmpFBO;
			_this16.tmpTex = _this16.writeToTexture;
			_this16.writeToTexture = _this16.readFromTexture;
			_this16.readFromTexture = _this16.tmpTex;
		}
		let target = this.dyeRenderTarget;
		let _this17 = this.advectShader.dt;
		_this17.dirty = true;
		_this17.data = dt;
		let _this18 = this.advectShader.target;
		_this18.dirty = true;
		_this18.data = target.readFromTexture;
		let _this19 = this.advectShader.velocity;
		_this19.dirty = true;
		_this19.data = this.velocityRenderTarget.readFromTexture;
		let shader5 = this.advectShader;
		if(shader5._active) {
			let _g36 = 0;
			let _g126 = shader5._uniforms;
			while(_g36 < _g126.length) {
				let u13 = _g126[_g36];
				++_g36;
				u13.apply();
			}
			let offset12 = 0;
			let _g127 = 0;
			let _g37 = shader5._attributes.length;
			while(_g127 < _g37) {
				let i12 = _g127++;
				let att12 = shader5._attributes[i12];
				let location12 = att12.location;
				if(location12 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location12);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location12,att12.itemCount,att12.type,false,shader5._aStride,offset12);
				}
				offset12 += att12.byteSize;
			}
		} else {
			if(!shader5._ready) shader5.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader5._prog);
			let _g38 = 0;
			let _g128 = shader5._uniforms;
			while(_g38 < _g128.length) {
				let u14 = _g128[_g38];
				++_g38;
				u14.apply();
			}
			let offset13 = 0;
			let _g129 = 0;
			let _g39 = shader5._attributes.length;
			while(_g129 < _g39) {
				let i13 = _g129++;
				let att13 = shader5._attributes[i13];
				let location13 = att13.location;
				if(location13 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location13);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location13,att13.itemCount,att13.type,false,shader5._aStride,offset13);
				}
				offset13 += att13.byteSize;
			}
			shader5._active = true;
		}
		target.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader5.deactivate();
		target.tmpFBO = target.writeFrameBufferObject;
		target.writeFrameBufferObject = target.readFrameBufferObject;
		target.readFrameBufferObject = target.tmpFBO;
		target.tmpTex = target.writeToTexture;
		target.writeToTexture = target.readFromTexture;
		target.readFromTexture = target.tmpTex;
	}
	,clear: function() {
		flu_modules_opengl_web_GL.current_context.viewport(0,0,this.width,this.height);
		flu_modules_opengl_web_GL.current_context.disable(3042);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
		let shader = this.clearVelocityShader;
		if(shader._active) {
			let _g = 0;
			let _g1 = shader._uniforms;
			while(_g < _g1.length) {
				let u = _g1[_g];
				++_g;
				u.apply();
			}
			let offset = 0;
			let _g11 = 0;
			let _g2 = shader._attributes.length;
			while(_g11 < _g2) {
				let i = _g11++;
				let att = shader._attributes[i];
				let location = att.location;
				if(location != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
				}
				offset += att.byteSize;
			}
		} else {
			if(!shader._ready) shader.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
			let _g3 = 0;
			let _g12 = shader._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = shader._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = shader._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
			shader._active = true;
		}
		this.velocityRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader.deactivate();
		let _this = this.velocityRenderTarget;
		_this.tmpFBO = _this.writeFrameBufferObject;
		_this.writeFrameBufferObject = _this.readFrameBufferObject;
		_this.readFrameBufferObject = _this.tmpFBO;
		_this.tmpTex = _this.writeToTexture;
		_this.writeToTexture = _this.readFromTexture;
		_this.readFromTexture = _this.tmpTex;
		let shader1 = this.clearPressureShader;
		if(shader1._active) {
			let _g5 = 0;
			let _g14 = shader1._uniforms;
			while(_g5 < _g14.length) {
				let u2 = _g14[_g5];
				++_g5;
				u2.apply();
			}
			let offset2 = 0;
			let _g15 = 0;
			let _g6 = shader1._attributes.length;
			while(_g15 < _g6) {
				let i2 = _g15++;
				let att2 = shader1._attributes[i2];
				let location2 = att2.location;
				if(location2 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
				}
				offset2 += att2.byteSize;
			}
		} else {
			if(!shader1._ready) shader1.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
			let _g7 = 0;
			let _g16 = shader1._uniforms;
			while(_g7 < _g16.length) {
				let u3 = _g16[_g7];
				++_g7;
				u3.apply();
			}
			let offset3 = 0;
			let _g17 = 0;
			let _g8 = shader1._attributes.length;
			while(_g17 < _g8) {
				let i3 = _g17++;
				let att3 = shader1._attributes[i3];
				let location3 = att3.location;
				if(location3 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
				}
				offset3 += att3.byteSize;
			}
			shader1._active = true;
		}
		this.pressureRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader1.deactivate();
		let _this1 = this.pressureRenderTarget;
		_this1.tmpFBO = _this1.writeFrameBufferObject;
		_this1.writeFrameBufferObject = _this1.readFrameBufferObject;
		_this1.readFrameBufferObject = _this1.tmpFBO;
		_this1.tmpTex = _this1.writeToTexture;
		_this1.writeToTexture = _this1.readFromTexture;
		_this1.readFromTexture = _this1.tmpTex;
		let _this2 = this.dyeRenderTarget;
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this2.readFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
		flu_modules_opengl_web_GL.current_context.clear(16384);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this2.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
		flu_modules_opengl_web_GL.current_context.clear(16384);
	}
	,__class__: GPUFluid
};
let shaderblox_ShaderBase = function() {
	this._textures = [];
	this._attributes = [];
	this._uniforms = [];
	this._name = ("" + Std.string(js_Boot.getClass(this))).split(".").pop();
	this.initSources();
	this.createProperties();
};
$hxClasses["shaderblox.ShaderBase"] = shaderblox_ShaderBase;
shaderblox_ShaderBase.__name__ = true;
shaderblox_ShaderBase.prototype = {
	initSources: function() {
	}
	,createProperties: function() {
	}
	,create: function() {
		this.compile(this._vertSource,this._fragSource);
		this._ready = true;
	}
	,destroy: function() {
		flu_modules_opengl_web_GL.current_context.deleteShader(this._vert);
		flu_modules_opengl_web_GL.current_context.deleteShader(this._frag);
		flu_modules_opengl_web_GL.current_context.deleteProgram(this._prog);
		this._prog = null;
		this._vert = null;
		this._frag = null;
		this._ready = false;
	}
	,compile: function(vertSource,fragSource) {
		let vertexShader = flu_modules_opengl_web_GL.current_context.createShader(35633);
		flu_modules_opengl_web_GL.current_context.shaderSource(vertexShader,vertSource);
		flu_modules_opengl_web_GL.current_context.compileShader(vertexShader);
		if(flu_modules_opengl_web_GL.current_context.getShaderParameter(vertexShader,35713) == 0) {
			console.log("Error compiling vertex shader: " + flu_modules_opengl_web_GL.current_context.getShaderInfoLog(vertexShader));
			console.log("\n" + vertSource);
			throw new js__$Boot_FluidError("Error compiling vertex shader");
		}
		let fragmentShader = flu_modules_opengl_web_GL.current_context.createShader(35632);
		flu_modules_opengl_web_GL.current_context.shaderSource(fragmentShader,fragSource);
		flu_modules_opengl_web_GL.current_context.compileShader(fragmentShader);
		if(flu_modules_opengl_web_GL.current_context.getShaderParameter(fragmentShader,35713) == 0) {
			console.log("Error compiling fragment shader: " + flu_modules_opengl_web_GL.current_context.getShaderInfoLog(fragmentShader) + "\n");
			let lines = fragSource.split("\n");
			let i = 0;
			let _g = 0;
			while(_g < lines.length) {
				let l = lines[_g];
				++_g;
				console.log(i++ + " - " + l);
			}
			throw new js__$Boot_FluidError("Error compiling fragment shader");
		}
		let shaderProgram = flu_modules_opengl_web_GL.current_context.createProgram();
		flu_modules_opengl_web_GL.current_context.attachShader(shaderProgram,vertexShader);
		flu_modules_opengl_web_GL.current_context.attachShader(shaderProgram,fragmentShader);
		flu_modules_opengl_web_GL.current_context.linkProgram(shaderProgram);
		if(flu_modules_opengl_web_GL.current_context.getProgramParameter(shaderProgram,35714) == 0) throw new js__$Boot_FluidError("Unable to initialize the shader program.\n" + flu_modules_opengl_web_GL.current_context.getProgramInfoLog(shaderProgram));
		let numUniforms = flu_modules_opengl_web_GL.current_context.getProgramParameter(shaderProgram,35718);
		let uniformLocations = new flu_ds_StringMap();
		while(numUniforms-- > 0) {
			let uInfo = flu_modules_opengl_web_GL.current_context.getActiveUniform(shaderProgram,numUniforms);
			let loc = flu_modules_opengl_web_GL.current_context.getUniformLocation(shaderProgram,uInfo.name);
			let tmp;
			let key = uInfo.name;
			if(__map_reserved[key] != null) uniformLocations.setReserved(key,loc); else uniformLocations.h[key] = loc;
			tmp = loc;
			tmp;
		}
		let numAttributes = flu_modules_opengl_web_GL.current_context.getProgramParameter(shaderProgram,35721);
		let attributeLocations = new flu_ds_StringMap();
		while(numAttributes-- > 0) {
			let aInfo = flu_modules_opengl_web_GL.current_context.getActiveAttrib(shaderProgram,numAttributes);
			let loc1 = flu_modules_opengl_web_GL.current_context.getAttribLocation(shaderProgram,aInfo.name);
			let tmp1;
			let key1 = aInfo.name;
			if(__map_reserved[key1] != null) attributeLocations.setReserved(key1,loc1); else attributeLocations.h[key1] = loc1;
			tmp1 = loc1;
			tmp1;
		}
		this._vert = vertexShader;
		this._frag = fragmentShader;
		this._prog = shaderProgram;
		let count = this._uniforms.length;
		let removeList = [];
		this._numTextures = 0;
		this._textures = [];
		let _g1 = 0;
		let _g11 = this._uniforms;
		while(_g1 < _g11.length) {
			let u = _g11[_g1];
			++_g1;
			let tmp2;
			let key2 = u.name;
			if(__map_reserved[key2] != null) tmp2 = uniformLocations.getReserved(key2); else tmp2 = uniformLocations.h[key2];
			let loc2 = tmp2;
			if(js_Boot.__instanceof(u,shaderblox_uniforms_UTexture)) {
				let t = u;
				t.samplerIndex = this._numTextures++;
				this._textures[t.samplerIndex] = t;
			}
			if(loc2 != null) u.location = loc2; else removeList.push(u);
		}
		while(removeList.length > 0) {
			let x = removeList.pop();
			HxOverrides.remove(this._uniforms,x);
		}
		let _g2 = 0;
		let _g12 = this._attributes;
		while(_g2 < _g12.length) {
			let a = _g12[_g2];
			++_g2;
			let tmp3;
			let key3 = a.name;
			if(__map_reserved[key3] != null) tmp3 = attributeLocations.getReserved(key3); else tmp3 = attributeLocations.h[key3];
			let loc3 = tmp3;
			a.location = loc3 == null?-1:loc3;
		}
	}
	,activate: function(initUniforms,initAttribs) {
		if(initAttribs == null) initAttribs = false;
		if(initUniforms == null) initUniforms = true;
		if(this._active) {
			if(initUniforms) {
				let _g = 0;
				let _g1 = this._uniforms;
				while(_g < _g1.length) {
					let u = _g1[_g];
					++_g;
					u.apply();
				}
			}
			if(initAttribs) {
				let offset = 0;
				let _g11 = 0;
				let _g2 = this._attributes.length;
				while(_g11 < _g2) {
					let i = _g11++;
					let att = this._attributes[i];
					let location = att.location;
					if(location != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,this._aStride,offset);
					}
					offset += att.byteSize;
				}
			}
			return;
		}
		if(!this._ready) this.create();
		flu_modules_opengl_web_GL.current_context.useProgram(this._prog);
		if(initUniforms) {
			let _g3 = 0;
			let _g12 = this._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
		}
		if(initAttribs) {
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = this._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = this._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,this._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
		}
		this._active = true;
	}
	,deactivate: function() {
		if(!this._active) return;
		this._active = false;
		this.disableAttributes();
	}
	,disableAttributes: function() {
		let _g1 = 0;
		let _g = this._attributes.length;
		while(_g1 < _g) {
			let i = _g1++;
			let idx = this._attributes[i].location;
			if(idx == -1) continue;
			flu_modules_opengl_web_GL.current_context.disableVertexAttribArray(idx);
		}
	}
	,__class__: shaderblox_ShaderBase
};
let FluidBase = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["FluidBase"] = FluidBase;
FluidBase.__name__ = true;
FluidBase.__super__ = shaderblox_ShaderBase;
FluidBase.prototype = $extend(shaderblox_ShaderBase.prototype,{
	set_FLOAT_VELOCITY: function(value) {
		this.FLOAT_VELOCITY = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_VELOCITY",value);
		if(this._ready) this.destroy();
		return value;
	}
	,set_FLOAT_PRESSURE: function(value) {
		this.FLOAT_PRESSURE = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_PRESSURE",value);
		if(this._ready) this.destroy();
		return value;
	}
	,set_FLOAT_DIVERGENCE: function(value) {
		this.FLOAT_DIVERGENCE = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_DIVERGENCE",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UFloat("aspectRatio",null);
		this.aspectRatio = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UVec2("invresolution",null);
		this.invresolution = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance2;
		this._attributes.push(instance2);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n";
	}
	,__class__: FluidBase
});
let Advect = function() {
	FluidBase.call(this);
};
$hxClasses["Advect"] = Advect;
Advect.__name__ = true;
Advect.__super__ = FluidBase;
Advect.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("velocity",null,false);
		this.velocity = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UTexture("target",null,false);
		this.target = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("dt",null);
		this.dt = instance2;
		this._uniforms.push(instance2);
		let instance3 = new shaderblox_uniforms_UFloat("rdx",null);
		this.rdx = instance3;
		this._uniforms.push(instance3);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D velocity;\r\nuniform sampler2D target;\r\nuniform float dt;\r\nuniform float rdx; \n\r\nvarying vec2 texelCoord;\r\nvarying vec2 p;\n\r\nvoid main(void){\r\n  \n  \r\n  vec2 tracedPos = p - dt * rdx * sampleVelocity(velocity, texelCoord ).xy; \n\r\n  \n  \n  tracedPos = aspectToTexelSpace(tracedPos);\r\n  \n  tracedPos /= invresolution;\r\n  \r\n  vec4 st;\r\n  st.xy = floor(tracedPos-.5)+.5; \n  st.zw = st.xy+1.;               \n\r\n  vec2 t = tracedPos - st.xy;\r\n\r\n  st *= invresolution.xyxy; \n  \r\n  vec4 tex11 = texture2D(target, st.xy );\r\n  vec4 tex21 = texture2D(target, st.zy );\r\n  vec4 tex12 = texture2D(target, st.xw );\r\n  vec4 tex22 = texture2D(target, st.zw );\r\n\r\n  \n  gl_FragColor = mix(mix(tex11, tex21, t.x), mix(tex12, tex22, t.x), t.y);\r\n}\n";
	}
	,__class__: Advect
});
let AdvectVelocity = function() {
	FluidBase.call(this);
};
$hxClasses["AdvectVelocity"] = AdvectVelocity;
AdvectVelocity.__name__ = true;
AdvectVelocity.__super__ = FluidBase;
AdvectVelocity.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("velocity",null,false);
		this.velocity = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UFloat("dt",null);
		this.dt = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("rdx",null);
		this.rdx = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D velocity;\r\nuniform float dt;\r\nuniform float rdx; \n\r\nvarying vec2 texelCoord;\r\nvarying vec2 p;\n\r\nvoid main(void){\r\n  \n  \r\n  vec2 tracedPos = p - dt * rdx * sampleVelocity(velocity, texelCoord).xy; \n\r\n  \n  \n  tracedPos = aspectToTexelSpace(tracedPos);\r\n  \n  tracedPos /= invresolution;\r\n  \r\n  vec4 st;\r\n  st.xy = floor(tracedPos-.5)+.5; \n  st.zw = st.xy+1.;               \n\r\n  vec2 t = tracedPos - st.xy;\r\n\r\n  st *= invresolution.xyxy; \n  \r\n  vec2 tex11 = sampleVelocity(velocity, st.xy);\r\n  vec2 tex21 = sampleVelocity(velocity, st.zy);\r\n  vec2 tex12 = sampleVelocity(velocity, st.xw);\r\n  vec2 tex22 = sampleVelocity(velocity, st.zw);\r\n  \r\n  \n  gl_FragColor = packFluidVelocity(mix(mix(tex11, tex21, t.x), mix(tex12, tex22, t.x), t.y));\r\n}\n";
	}
	,__class__: AdvectVelocity
});
let Divergence = function() {
	FluidBase.call(this);
};
$hxClasses["Divergence"] = Divergence;
Divergence.__name__ = true;
Divergence.__super__ = FluidBase;
Divergence.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("velocity",null,false);
		this.velocity = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UFloat("halfrdx",null);
		this.halfrdx = instance1;
		this._uniforms.push(instance1);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D velocity;\t\nuniform float halfrdx;\t\n\r\nvarying vec2 texelCoord;\r\n\r\nvoid main(void){\r\n\t\n \t\n\tvec2 L = sampleVelocity(velocity, texelCoord - vec2(invresolution.x, 0));\r\n\tvec2 R = sampleVelocity(velocity, texelCoord + vec2(invresolution.x, 0));\r\n\tvec2 B = sampleVelocity(velocity, texelCoord - vec2(0, invresolution.y));\r\n\tvec2 T = sampleVelocity(velocity, texelCoord + vec2(0, invresolution.y));\r\n\r\n\tgl_FragColor = packFluidDivergence( halfrdx * ((R.x - L.x) + (T.y - B.y)));\r\n}\r\n\n";
	}
	,__class__: Divergence
});
let PressureSolve = function() {
	FluidBase.call(this);
};
$hxClasses["PressureSolve"] = PressureSolve;
PressureSolve.__name__ = true;
PressureSolve.__super__ = FluidBase;
PressureSolve.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("pressure",null,false);
		this.pressure = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UTexture("divergence",null,false);
		this.divergence = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("alpha",null);
		this.alpha = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D pressure;\r\nuniform sampler2D divergence;\r\nuniform float alpha;\n\r\nvarying vec2 texelCoord;\r\n\r\nvoid main(void){\r\n  \n  \n  float L = samplePressue(pressure, texelCoord - vec2(invresolution.x, 0));\r\n  float R = samplePressue(pressure, texelCoord + vec2(invresolution.x, 0));\r\n  float B = samplePressue(pressure, texelCoord - vec2(0, invresolution.y));\r\n  float T = samplePressue(pressure, texelCoord + vec2(0, invresolution.y));\r\n\r\n  float bC = sampleDivergence(divergence, texelCoord);\r\n\r\n  gl_FragColor = packFluidPressure((L + R + B + T + alpha * bC) * .25);\n}\n";
	}
	,__class__: PressureSolve
});
let PressureGradientSubstract = function() {
	FluidBase.call(this);
};
$hxClasses["PressureGradientSubstract"] = PressureGradientSubstract;
PressureGradientSubstract.__name__ = true;
PressureGradientSubstract.__super__ = FluidBase;
PressureGradientSubstract.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("pressure",null,false);
		this.pressure = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UTexture("velocity",null,false);
		this.velocity = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("halfrdx",null);
		this.halfrdx = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D pressure;\r\nuniform sampler2D velocity;\r\nuniform float halfrdx;\r\n\r\nvarying vec2 texelCoord;\r\n\r\nvoid main(void){\r\n  float L = samplePressue(pressure, texelCoord - vec2(invresolution.x, 0));\r\n  float R = samplePressue(pressure, texelCoord + vec2(invresolution.x, 0));\r\n  float B = samplePressue(pressure, texelCoord - vec2(0, invresolution.y));\r\n  float T = samplePressue(pressure, texelCoord + vec2(0, invresolution.y));\r\n\r\n  vec2 v = sampleVelocity(velocity, texelCoord);\r\n\r\n  gl_FragColor = packFluidVelocity(v - halfrdx*vec2(R-L, T-B));\r\n}\r\n\r\n\n";
	}
	,__class__: PressureGradientSubstract
});
let ApplyForces = function() {
	FluidBase.call(this);
};
$hxClasses["ApplyForces"] = ApplyForces;
ApplyForces.__name__ = true;
ApplyForces.__super__ = FluidBase;
ApplyForces.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("velocity",null,false);
		this.velocity = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UFloat("dt",null);
		this.dt = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("dx",null);
		this.dx = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D velocity;\n\tuniform float dt;\n\tuniform float dx;\n\n\tvarying vec2 texelCoord;\n\tvarying vec2 p;\n";
	}
	,__class__: ApplyForces
});
let UpdateDye = function() {
	FluidBase.call(this);
};
$hxClasses["UpdateDye"] = UpdateDye;
UpdateDye.__name__ = true;
UpdateDye.__super__ = FluidBase;
UpdateDye.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("dye",null,false);
		this.dye = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UFloat("dt",null);
		this.dt = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UFloat("dx",null);
		this.dx = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D dye;\n\tuniform float dt;\n\tuniform float dx;\n\n\tvarying vec2 texelCoord;\n\tvarying vec2 p;\n";
	}
	,__class__: UpdateDye
});
let ClearVelocity = function() {
	FluidBase.call(this);
};
$hxClasses["ClearVelocity"] = ClearVelocity;
ClearVelocity.__name__ = true;
ClearVelocity.__super__ = FluidBase;
ClearVelocity.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nvoid main(){\n\tgl_FragColor = packFluidVelocity(vec2(0));\n}\n";
	}
	,__class__: ClearVelocity
});
let ClearPressure = function() {
	FluidBase.call(this);
};
$hxClasses["ClearPressure"] = ClearPressure;
ClearPressure.__name__ = true;
ClearPressure.__super__ = FluidBase;
ClearPressure.prototype = $extend(FluidBase.prototype,{
	createProperties: function() {
		FluidBase.prototype.createProperties.call(this);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nvoid main(){\n\tgl_FragColor = packFluidPressure(0.0);\n}\n";
	}
	,__class__: ClearPressure
});
let GPUParticles = function(count) {
	this.floatDataType = null;
	if(GPUCapabilities.get_writeToFloat()) this.floatDataType = 5126; else if(GPUCapabilities.get_writeToHalfFloat()) this.floatDataType = GPUCapabilities.get_HALF_FLOAT();
	this.floatData = this.floatDataType != null;
	this.textureQuad = gltoolbox_GeometryTools.getCachedUnitQuad();
	this.velocityStepShader = new VelocityStep();
	this.positionStepShader = new PositionStep();
	this.initialPositionShader = new InitialPosition();
	this.initialVelocityShader = new InitialVelocity();
	this.velocityStepShader.set_FLOAT_DATA(this.floatData?"true":"false");
	this.positionStepShader.set_FLOAT_DATA(this.floatData?"true":"false");
	this.initialPositionShader.set_FLOAT_DATA(this.floatData?"true":"false");
	this.initialVelocityShader.set_FLOAT_DATA(this.floatData?"true":"false");
	let _this = this.velocityStepShader.dragCoefficient;
	_this.dirty = true;
	_this.data = 1;
	this.velocityStepShader.flowScale.data.x = 1;
	this.velocityStepShader.flowScale.data.y = 1;
	this.velocityStepShader.set_FLOAT_VELOCITY("false");
	this.setCount(count);
	let shader = this.initialPositionShader;
	let target = this.positionData;
	flu_modules_opengl_web_GL.current_context.viewport(0,0,target.width,target.height);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target.writeFrameBufferObject);
	flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
	if(shader._active) {
		let _g = 0;
		let _g1 = shader._uniforms;
		while(_g < _g1.length) {
			let u = _g1[_g];
			++_g;
			u.apply();
		}
		let offset = 0;
		let _g11 = 0;
		let _g2 = shader._attributes.length;
		while(_g11 < _g2) {
			let i = _g11++;
			let att = shader._attributes[i];
			let location = att.location;
			if(location != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
			}
			offset += att.byteSize;
		}
	} else {
		if(!shader._ready) shader.create();
		flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
		let _g3 = 0;
		let _g12 = shader._uniforms;
		while(_g3 < _g12.length) {
			let u1 = _g12[_g3];
			++_g3;
			u1.apply();
		}
		let offset1 = 0;
		let _g13 = 0;
		let _g4 = shader._attributes.length;
		while(_g13 < _g4) {
			let i1 = _g13++;
			let att1 = shader._attributes[i1];
			let location1 = att1.location;
			if(location1 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
			}
			offset1 += att1.byteSize;
		}
		shader._active = true;
	}
	flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
	shader.deactivate();
	target.tmpFBO = target.writeFrameBufferObject;
	target.writeFrameBufferObject = target.readFrameBufferObject;
	target.readFrameBufferObject = target.tmpFBO;
	target.tmpTex = target.writeToTexture;
	target.writeToTexture = target.readFromTexture;
	target.readFromTexture = target.tmpTex;
	let shader1 = this.initialVelocityShader;
	let target1 = this.velocityData;
	flu_modules_opengl_web_GL.current_context.viewport(0,0,target1.width,target1.height);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target1.writeFrameBufferObject);
	flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
	if(shader1._active) {
		let _g5 = 0;
		let _g14 = shader1._uniforms;
		while(_g5 < _g14.length) {
			let u2 = _g14[_g5];
			++_g5;
			u2.apply();
		}
		let offset2 = 0;
		let _g15 = 0;
		let _g6 = shader1._attributes.length;
		while(_g15 < _g6) {
			let i2 = _g15++;
			let att2 = shader1._attributes[i2];
			let location2 = att2.location;
			if(location2 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
			}
			offset2 += att2.byteSize;
		}
	} else {
		if(!shader1._ready) shader1.create();
		flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
		let _g7 = 0;
		let _g16 = shader1._uniforms;
		while(_g7 < _g16.length) {
			let u3 = _g16[_g7];
			++_g7;
			u3.apply();
		}
		let offset3 = 0;
		let _g17 = 0;
		let _g8 = shader1._attributes.length;
		while(_g17 < _g8) {
			let i3 = _g17++;
			let att3 = shader1._attributes[i3];
			let location3 = att3.location;
			if(location3 != -1) {
				flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
				flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
			}
			offset3 += att3.byteSize;
		}
		shader1._active = true;
	}
	flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
	shader1.deactivate();
	target1.tmpFBO = target1.writeFrameBufferObject;
	target1.writeFrameBufferObject = target1.readFrameBufferObject;
	target1.readFrameBufferObject = target1.tmpFBO;
	target1.tmpTex = target1.writeToTexture;
	target1.writeToTexture = target1.readFromTexture;
	target1.readFromTexture = target1.tmpTex;
};
$hxClasses["GPUParticles"] = GPUParticles;
GPUParticles.__name__ = true;
GPUParticles.prototype = {
	reset: function() {
		let shader = this.initialPositionShader;
		let target = this.positionData;
		flu_modules_opengl_web_GL.current_context.viewport(0,0,target.width,target.height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
		if(shader._active) {
			let _g = 0;
			let _g1 = shader._uniforms;
			while(_g < _g1.length) {
				let u = _g1[_g];
				++_g;
				u.apply();
			}
			let offset = 0;
			let _g11 = 0;
			let _g2 = shader._attributes.length;
			while(_g11 < _g2) {
				let i = _g11++;
				let att = shader._attributes[i];
				let location = att.location;
				if(location != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
				}
				offset += att.byteSize;
			}
		} else {
			if(!shader._ready) shader.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
			let _g3 = 0;
			let _g12 = shader._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = shader._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = shader._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
			shader._active = true;
		}
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader.deactivate();
		target.tmpFBO = target.writeFrameBufferObject;
		target.writeFrameBufferObject = target.readFrameBufferObject;
		target.readFrameBufferObject = target.tmpFBO;
		target.tmpTex = target.writeToTexture;
		target.writeToTexture = target.readFromTexture;
		target.readFromTexture = target.tmpTex;
		let shader1 = this.initialVelocityShader;
		let target1 = this.velocityData;
		flu_modules_opengl_web_GL.current_context.viewport(0,0,target1.width,target1.height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target1.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
		if(shader1._active) {
			let _g5 = 0;
			let _g14 = shader1._uniforms;
			while(_g5 < _g14.length) {
				let u2 = _g14[_g5];
				++_g5;
				u2.apply();
			}
			let offset2 = 0;
			let _g15 = 0;
			let _g6 = shader1._attributes.length;
			while(_g15 < _g6) {
				let i2 = _g15++;
				let att2 = shader1._attributes[i2];
				let location2 = att2.location;
				if(location2 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
				}
				offset2 += att2.byteSize;
			}
		} else {
			if(!shader1._ready) shader1.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
			let _g7 = 0;
			let _g16 = shader1._uniforms;
			while(_g7 < _g16.length) {
				let u3 = _g16[_g7];
				++_g7;
				u3.apply();
			}
			let offset3 = 0;
			let _g17 = 0;
			let _g8 = shader1._attributes.length;
			while(_g17 < _g8) {
				let i3 = _g17++;
				let att3 = shader1._attributes[i3];
				let location3 = att3.location;
				if(location3 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
				}
				offset3 += att3.byteSize;
			}
			shader1._active = true;
		}
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader1.deactivate();
		target1.tmpFBO = target1.writeFrameBufferObject;
		target1.writeFrameBufferObject = target1.readFrameBufferObject;
		target1.readFrameBufferObject = target1.tmpFBO;
		target1.tmpTex = target1.writeToTexture;
		target1.writeToTexture = target1.readFromTexture;
		target1.readFromTexture = target1.tmpTex;
	}
	,setCount: function(newCount) {
		let dataWidth = Math.ceil(Math.sqrt(newCount));
		if(this.positionData == null) {
			let tmp1;
			let params = { channelType : 6408, dataType : this.floatData?this.floatDataType:5121, filter : 9728};
			tmp1 = function(width,height) {
				return gltoolbox_TextureTools.createTexture(width,height,params);
			};
			this.positionData = new gltoolbox_render_RenderTarget2Phase(dataWidth,dataWidth,tmp1);
		} else this.positionData.resize(dataWidth,dataWidth);
		if(this.velocityData == null) {
			let tmp2;
			let params1 = { channelType : 6408, dataType : this.floatData?this.floatDataType:5121, filter : 9728};
			tmp2 = function(width1,height1) {
				return gltoolbox_TextureTools.createTexture(width1,height1,params1);
			};
			this.velocityData = new gltoolbox_render_RenderTarget2Phase(dataWidth,dataWidth,tmp2);
		} else this.velocityData.resize(dataWidth,dataWidth);
		if(this.particleUVs != null) flu_modules_opengl_web_GL.current_context.deleteBuffer(this.particleUVs);
		this.particleUVs = flu_modules_opengl_web_GL.current_context.createBuffer();
		let tmp;
		let elements = dataWidth * dataWidth * 2;
		let this1;
		if(elements != null) this1 = new Float32Array(elements); else this1 = null;
		tmp = this1;
		let arrayUVs = tmp;
		let index;
		let _g = 0;
		while(_g < dataWidth) {
			let i = _g++;
			let _g1 = 0;
			while(_g1 < dataWidth) {
				let j = _g1++;
				index = (i * dataWidth + j) * 2;
				arrayUVs[index] = i / dataWidth;
				let idx = ++index;
				arrayUVs[idx] = j / dataWidth;
			}
		}
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.particleUVs);
		flu_modules_opengl_web_GL.current_context.bufferData(34962,arrayUVs,35044);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,null);
		let particleSpacing = 2 / dataWidth;
		let _this = this.initialPositionShader.jitterAmount;
		_this.dirty = true;
		_this.data = particleSpacing;
		return this.count = newCount;
	}
	,__class__: GPUParticles
};
let PlaneTexture = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["PlaneTexture"] = PlaneTexture;
PlaneTexture.__name__ = true;
PlaneTexture.__super__ = shaderblox_ShaderBase;
PlaneTexture.prototype = $extend(shaderblox_ShaderBase.prototype,{
	createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance;
		this._attributes.push(instance);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n";
	}
	,__class__: PlaneTexture
});
let ParticleBase = function() {
	PlaneTexture.call(this);
};
$hxClasses["ParticleBase"] = ParticleBase;
ParticleBase.__name__ = true;
ParticleBase.__super__ = PlaneTexture;
ParticleBase.prototype = $extend(PlaneTexture.prototype,{
	createProperties: function() {
		PlaneTexture.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UFloat("dt",null);
		this.dt = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UTexture("positionData",null,false);
		this.positionData = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UTexture("velocityData",null,false);
		this.velocityData = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n\nuniform float dt;\n\tuniform sampler2D positionData;\n\tuniform sampler2D velocityData;\n";
	}
	,__class__: ParticleBase
});
let VelocityStep = function() {
	ParticleBase.call(this);
};
$hxClasses["VelocityStep"] = VelocityStep;
VelocityStep.__name__ = true;
VelocityStep.__super__ = ParticleBase;
VelocityStep.prototype = $extend(ParticleBase.prototype,{
	set_FLOAT_VELOCITY: function(value) {
		this.FLOAT_VELOCITY = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_VELOCITY",value);
		if(this._ready) this.destroy();
		return value;
	}
	,set_FLOAT_DATA: function(value) {
		this.FLOAT_DATA = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_DATA",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		ParticleBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UFloat("dragCoefficient",null);
		this.dragCoefficient = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UVec2("flowScale",null);
		this.flowScale = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UTexture("flowVelocityField",null,false);
		this.flowVelocityField = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n\nuniform float dt;\n\tuniform sampler2D positionData;\n\tuniform sampler2D velocityData;\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\n\n\tuniform float dragCoefficient;\n\tuniform vec2 flowScale;\n\tuniform sampler2D flowVelocityField;\n\n\tvoid main(){\n\t\t\n\t\tvec2 p = unpackParticlePosition(texture2D(positionData, texelCoord));\n\t\tvec2 v = unpackParticleVelocity(texture2D(velocityData, texelCoord));\n\n\t\t\n\t\tvec2 vf = unpackFluidVelocity(texture2D(flowVelocityField, p*.5 + .5)) * flowScale;\n\n\t\t\n\t\tv += (vf - v) * dragCoefficient;\n\n\t\t\n\t\tgl_FragColor = packParticleVelocity(v);\n\t}\n";
	}
	,__class__: VelocityStep
});
let PositionStep = function() {
	ParticleBase.call(this);
};
$hxClasses["PositionStep"] = PositionStep;
PositionStep.__name__ = true;
PositionStep.__super__ = ParticleBase;
PositionStep.prototype = $extend(ParticleBase.prototype,{
	set_FLOAT_DATA: function(value) {
		this.FLOAT_DATA = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_DATA",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		ParticleBase.prototype.createProperties.call(this);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n\nuniform float dt;\n\tuniform sampler2D positionData;\n\tuniform sampler2D velocityData;\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\n\n\tvoid main(){\n\t\t\n\t\tvec2 p = unpackParticlePosition(texture2D(positionData, texelCoord));\n\t\tvec2 v = unpackParticleVelocity(texture2D(velocityData, texelCoord));\n\n\t\t\n\t\tp += v * dt;\n\n\t\t\n\t\tgl_FragColor = packParticlePosition(p);\n\t}\n";
	}
	,__class__: PositionStep
});
let InitialPosition = function() {
	PlaneTexture.call(this);
};
$hxClasses["InitialPosition"] = InitialPosition;
InitialPosition.__name__ = true;
InitialPosition.__super__ = PlaneTexture;
InitialPosition.prototype = $extend(PlaneTexture.prototype,{
	set_FLOAT_DATA: function(value) {
		this.FLOAT_DATA = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_DATA",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		PlaneTexture.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UFloat("jitterAmount",null);
		this.jitterAmount = instance;
		this._uniforms.push(instance);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\nfloat rand(vec2 co){\r\n\treturn fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n}\n\n\n\tuniform float jitterAmount;\n\n\tvoid main(){\n\t\tvec2 initialPosition = vec2(texelCoord.x, texelCoord.y) * 2.0 - 1.0;\n\t\t\n\t\tinitialPosition.x += rand(initialPosition)*jitterAmount;\n\t\tinitialPosition.y += rand(initialPosition + 0.3415)*jitterAmount;\n\n\t\tgl_FragColor = packParticlePosition(initialPosition);\n\t}\n";
	}
	,__class__: InitialPosition
});
let InitialVelocity = function() {
	PlaneTexture.call(this);
};
$hxClasses["InitialVelocity"] = InitialVelocity;
InitialVelocity.__name__ = true;
InitialVelocity.__super__ = PlaneTexture;
InitialVelocity.prototype = $extend(PlaneTexture.prototype,{
	set_FLOAT_DATA: function(value) {
		this.FLOAT_DATA = value;
		this._fragSource = shaderblox_glsl_GLSLTools.injectConstValue(this._fragSource,"FLOAT_DATA",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		PlaneTexture.prototype.createProperties.call(this);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n\t}\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec2 texelCoord;\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\n\t\n\tvoid main(){\n\t\tgl_FragColor = packParticleVelocity(vec2(0));\n\t}\n";
	}
	,__class__: InitialVelocity
});
let RenderParticles = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["RenderParticles"] = RenderParticles;
RenderParticles.__name__ = true;
RenderParticles.__super__ = shaderblox_ShaderBase;
RenderParticles.prototype = $extend(shaderblox_ShaderBase.prototype,{
	set_FLOAT_DATA: function(value) {
		this.FLOAT_DATA = value;
		this._vertSource = shaderblox_glsl_GLSLTools.injectConstValue(this._vertSource,"FLOAT_DATA",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("positionData",null,false);
		this.positionData = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UTexture("velocityData",null,false);
		this.velocityData = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_attributes_FloatAttribute("particleUV",0,2);
		this.particleUV = instance2;
		this._attributes.push(instance2);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\n\n\tuniform sampler2D positionData;\n\tuniform sampler2D velocityData;\n\n\tattribute vec2 particleUV;\n\tvarying vec4 color;\n\t\n\tvoid main(){\n\t\tvec2 p = unpackParticlePosition(texture2D(positionData, particleUV));\n\t\tvec2 v = unpackParticleVelocity(texture2D(velocityData, particleUV));\n\n\t\tgl_PointSize = 1.0;\n\t\tgl_Position = vec4(p, 0.0, 1.0);\n\n\t\tcolor = vec4(1.0, 1.0, 1.0, 1.0);\n\t}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec4 color;\n\n\tvoid main(){\n\t\tgl_FragColor = vec4(color);\n\t}\n";
	}
	,__class__: RenderParticles
});
let HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	let x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	let len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	let i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
let Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = true;
Lambda.fold = function(it,f,first) {
	let $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		let x = $it0.next();
		first = f(x,first);
	}
	return first;
};
let flu_App = function() {
	this.next_render = 0;
	this.next_tick = 0;
	this.cur_frame_start = 0.0;
	this.current_time = 0;
	this.last_frame_start = 0.0;
	this.delta_sim = 0.016666666666666666;
	this.delta_time = 0.016666666666666666;
	this.max_frame_time = 0.25;
	this.update_rate = 0;
	this.render_rate = -1;
	this.fixed_delta = 0;
	this.timescale = 1;
};

$hxClasses["fluidState.App"] = flu_App;
flu_App.__name__ = true;
flu_App.prototype = {
	config: function(config) {
		return config;
	}
	,ready: function() {
	}
	,update: function(dt) {
	}
	,ondestroy: function() {
	}
	,onevent: function(event) {
	}
	,ontickstart: function() {
	}
	,ontickend: function() {
	}
	,onkeydown: function(keycode,scancode,repeat,mod,timestamp,window_id) {
	}
	,onkeyup: function(keycode,scancode,repeat,mod,timestamp,window_id) {
	}
	,ontextinput: function(text,start,length,type,timestamp,window_id) {
	}
	,onmousedown: function(x,y,button,timestamp,window_id) {
	}
	,onmouseup: function(x,y,button,timestamp,window_id) {
	}
	,onmousewheel: function(x,y,timestamp,window_id) {
	}
	,onmousemove: function(x,y,xrel,yrel,timestamp,window_id) {
	}
	,ontouchdown: function(x,y,touch_id,timestamp) {
	}
	,ontouchup: function(x,y,touch_id,timestamp) {
	}
	,ontouchmove: function(x,y,dx,dy,touch_id,timestamp) {
	}
	,ongamepadaxis: function(gamepad,axis,value,timestamp) {
	}
	,ongamepaddown: function(gamepad,button,value,timestamp) {
	}
	,ongamepadup: function(gamepad,button,value,timestamp) {
	}
	,ongamepaddevice: function(gamepad,id,type,timestamp) {
	}
	,on_internal_init: function() {
		this.cur_frame_start = flu.core.timestamp();
		this.last_frame_start = this.cur_frame_start;
		this.current_time = 0;
		this.delta_time = 0.016;
	}
	,on_internal_update: function() {
		if(this.freeze != true) {
			if(this.update_rate != 0) {
				if(flu.core.timestamp() < this.next_tick) return;
				this.next_tick = flu.core.timestamp() + this.update_rate;
			}
			this.cur_frame_start = flu.core.timestamp();
			this.delta_time = this.cur_frame_start - this.last_frame_start;
			this.last_frame_start = this.cur_frame_start;
			if(this.delta_time > this.max_frame_time) this.delta_time = this.max_frame_time;
			let used_delta = this.fixed_delta == 0?this.delta_time:this.fixed_delta;
			used_delta *= this.timescale;
			this.delta_sim = used_delta;
			this.current_time += used_delta;
			this.app.do_internal_update(used_delta);
		}
	}
	,on_internal_render: function() {
		if(this.render_rate != 0) {
			if(this.render_rate < 0 || this.next_render < flu.core.timestamp()) {
				this.app.render();
				this.next_render += this.render_rate;
			}
		}
	}
	,__class__: flu_App
};

let Main = function() {
	this.rshiftDown = false;
	this.lshiftDown = false;
	this.qualityDirection = 10;
	this.timer = new flu_Timer(19000);
	this.pointSize = 1;
	this.dyeColor = new shaderblox_uniforms_Vector3();
	this.dyeColorHSB = new hxColorToolkit_spaces_HSB(180,100,100);
	this.hueCycleEnabled = false;
	this.renderFluidEnabled = true;
	this.renderParticlesEnabled = true;
	this.lastMouseFluid = new shaderblox_uniforms_Vector2();
	this.lastMouse = new shaderblox_uniforms_Vector2();
	this.mouseFluid = new shaderblox_uniforms_Vector2();
	this.mouse = new shaderblox_uniforms_Vector2();
	this.lastMousePointKnown = false;
	this.mousePointKnown = true;
	this.mouse.x = 500;
	this.mouse.y = 400;
	this.isMouseDown = true;
	this.freeze = false;

	flu_App.call(this);
	this.performanceMonitor = new PerformanceMonitor(35,null,800);
				
	this.set_simulationQuality(SimulationQuality.UltraLow);
	this.performanceMonitor.fpsTooLowCallback = $bind(this,this.lowerQualityRequired);
	let urlParams = js_Web.getParams();
	if(__map_reserved.q != null?urlParams.existsReserved("q"):urlParams.h.hasOwnProperty("q")) {
		let q = StringTools.trim((__map_reserved.q != null?urlParams.getReserved("q"):urlParams.h["q"]).toLowerCase());
		let _g = 0;
		let _g1 = Type.allEnums(SimulationQuality);
		
		while(_g < _g1.length) {
			let e = _g1[_g];
			++_g;
			let name = e[0].toLowerCase();
			
			if(q == name) {
				this.set_simulationQuality(e);
				this.performanceMonitor.fpsTooLowCallback = null;
				
				break;
			}
		}
	}
	if(__map_reserved.iterations != null?urlParams.existsReserved("iterations"):urlParams.h.hasOwnProperty("iterations")) {
		let iterationsParam = Std.parseInt(__map_reserved.iterations != null?urlParams.getReserved("iterations"):urlParams.h["iterations"]);
		if(((iterationsParam | 0) === iterationsParam)) this.set_fluidIterations(iterationsParam);
	}
};
$hxClasses["Main"] = Main;
Main.__name__ = true;
Main.__super__ = flu_App;
Main.prototype = $extend(flu_App.prototype,{
	config: function(config) {
		config.web.no_context_menu = false;
		config.web.prevent_default_mouse_wheel = false;
		config.window.borderless = true;
		config.window.fullscreen = true;
		config.window.width = window.innerWidth;
		config.window.height = window.innerHeight;
		config.render.antialiasing = 0;
		return config;
	}
	,ready: function() {

		const ref = this;
		if (this.app.window.width >= 460) {
			const id= setInterval(
				function() {
					ref.mousePointKnown = ref.mousePointKnown == false ? true : false;
					setTimeout(
						function() {
							clearInterval(2);
							ref.mousePointKnown = false;
							setTimeout(
								function() {
									ref.freeze = true;
								}, 18000, ref
							);
						}, 5000, ref
					);
				}, 100, ref
			);
		}else {
			setTimeout(
				function() {
					ref.mousePointKnown = ref.mousePointKnown == false ? true : false;
				}, 800, ref
			);
		}
		this.window = this.app.window;
		this.init();
		this.window.onevent = $bind(this,this.onWindowEvent);
		this.window.onrender = $bind(this,this.render);
	}
	
	,init: function() {
		let _g = this;
		flu_modules_opengl_web_GL.current_context.disable(2929);
		flu_modules_opengl_web_GL.current_context.disable(2884);
		flu_modules_opengl_web_GL.current_context.disable(3024);
		this.textureQuad = gltoolbox_GeometryTools.createQuad(0,0,1,1);
		this.blitTextureShader = new BlitTexture();
		this.debugBlitTextureShader = new DebugBlitTexture();
		this.renderFluidShader = new FluidRender();
		this.renderParticlesShader = new ColorParticleMotion();
		this.updateDyeShader = new MouseDye();
		this.mouseForceShader = new MouseForce();
		let _this = this.updateDyeShader.mouse;
		_this.dirty = true;
		_this.data = this.mouseFluid;
		let _this1 = this.updateDyeShader.lastMouse;
		_this1.dirty = true;
		_this1.data = this.lastMouseFluid;
		let _this2 = this.updateDyeShader.dyeColor;
		_this2.dirty = true;
		_this2.data = this.dyeColor;
		let _this3 = this.mouseForceShader.mouse;
		_this3.dirty = true;
		_this3.data = this.mouseFluid;
		let _this4 = this.mouseForceShader.lastMouse;
		_this4.dirty = true;
		_this4.data = this.lastMouseFluid;
		this.updatePointSize();
		let cellScale = 32;
		this.fluid = new GPUFluid(Math.round(this.window.width * this.fluidScale),Math.round(this.window.height * this.fluidScale),cellScale,this.fluidIterations);
		let _this5 = this.fluid;
		_this5.updateDyeShader = this.updateDyeShader;
		let _this6 = _this5.updateDyeShader.dx;
		_this6.dirty = true;
		_this6.data = _this5.cellSize;
		let shader = _this5.updateDyeShader;
		if(shader == null) null; else {
			let _this7 = shader.aspectRatio;
			{
				_this7.dirty = true;
				_this7.data = _this5.aspectRatio;
			}
			shader.invresolution.data.x = 1 / _this5.width;
			shader.invresolution.data.y = 1 / _this5.height;
			let v;
			v = _this5.floatVelocity?"true":"false";
			if(shader.FLOAT_VELOCITY != v) shader.set_FLOAT_VELOCITY(v);
			v = _this5.floatPressure?"true":"false";
			if(shader.FLOAT_PRESSURE != v) shader.set_FLOAT_PRESSURE(v);
			v = _this5.floatDivergence?"true":"false";
			if(shader.FLOAT_DIVERGENCE != v) shader.set_FLOAT_DIVERGENCE(v);
		}
		_this5.updateDyeShader;
		let _this8 = this.fluid;
		_this8.applyForcesShader = this.mouseForceShader;
		let _this9 = _this8.applyForcesShader.dx;
		_this9.dirty = true;
		_this9.data = _this8.cellSize;
		let shader1 = _this8.applyForcesShader;
		if(shader1 == null) null; else {
			let _this10 = shader1.aspectRatio;
			{
				_this10.dirty = true;
				_this10.data = _this8.aspectRatio;
			}
			shader1.invresolution.data.x = 1 / _this8.width;
			shader1.invresolution.data.y = 1 / _this8.height;
			let v1;
			v1 = _this8.floatVelocity?"true":"false";
			if(shader1.FLOAT_VELOCITY != v1) shader1.set_FLOAT_VELOCITY(v1);
			v1 = _this8.floatPressure?"true":"false";
			if(shader1.FLOAT_PRESSURE != v1) shader1.set_FLOAT_PRESSURE(v1);
			v1 = _this8.floatDivergence?"true":"false";
			if(shader1.FLOAT_DIVERGENCE != v1) shader1.set_FLOAT_DIVERGENCE(v1);
		}
		_this8.applyForcesShader;
		this.particles = new GPUParticles(this.particleCount);
		this.particles.velocityStepShader.flowScale.data.x = 1 / (this.fluid.cellSize * this.fluid.aspectRatio);
		this.particles.velocityStepShader.flowScale.data.y = 1 / this.fluid.cellSize;
		this.particles.velocityStepShader.set_FLOAT_VELOCITY(this.fluid.floatVelocity?"true":"false");
		let _this11 = this.particles.velocityStepShader.dragCoefficient;
		_this11.dirty = true;
		_this11.data = 1;
		this.renderParticlesShader.set_FLOAT_DATA(this.particles.floatData?"true":"false");
		let _this12 = this.dyeColor;
		_this12.x = 51;
		_this12.y = 78;
		_this12.z = 255;
		this.initTime = flu_Timer.stamp();
		this.lastTime = this.initTime;
	}
	,update: function(dt) {
		this.time = flu_Timer.stamp() - this.initTime;
		let _this = this.performanceMonitor;
		if(dt > 0) {
			let fps = 1 / dt;
			if(fps < _this.fpsIgnoreBounds[0] && fps > _this.fpsIgnoreBounds[1]) null; else {
				_this.fpsSample.add(fps);
				if(_this.fpsSample.sampleCount < _this.fpsSample.length) null; else {
					let now = flu_Timer.stamp() * 1000;
					if(_this.fpsSample.average < _this.lowerBoundFPS) {
						if(_this.lowerBoundEnterTime == null) _this.lowerBoundEnterTime = now;
						if(now - _this.lowerBoundEnterTime >= _this.thresholdTime_ms && _this.fpsTooLowCallback != null) {
							_this.fpsTooLowCallback((_this.lowerBoundFPS - _this.fpsSample.average) / _this.lowerBoundFPS);
							_this.fpsSample.clear();
							_this.lowerBoundEnterTime = null;
						}
					} else if(_this.fpsSample.average > _this.upperBoundFPS) {
						if(_this.upperBoundEnterTime == null) _this.upperBoundEnterTime = now;
						if(now - _this.upperBoundEnterTime >= _this.thresholdTime_ms && _this.fpsTooHighCallback != null) {
							_this.fpsTooHighCallback((_this.fpsSample.average - _this.upperBoundFPS) / _this.upperBoundFPS);
							_this.fpsSample.clear();
							_this.upperBoundEnterTime = null;
						}
					} else {
						_this.lowerBoundEnterTime = null;
						_this.upperBoundEnterTime = null;
					}
				}
			}
		}
		dt = 0.090;
		let _this1 = this.updateDyeShader.isMouseDown;
		let tmp;
		_this1.dirty = true;
		tmp = _this1.data = this.isMouseDown && this.lastMousePointKnown;
		tmp;
		let _this2 = this.mouseForceShader.isMouseDown;
		let tmp1;
		_this2.dirty = true;
		tmp1 = _this2.data = this.isMouseDown && this.lastMousePointKnown;
		tmp1;
		this.fluid.step(dt);
		let _this3 = this.particles.velocityStepShader.flowVelocityField;
		_this3.dirty = true;
		_this3.data = this.fluid.velocityRenderTarget.readFromTexture;
		if(this.renderParticlesEnabled) {
			let _this4 = this.particles;
			let _this5 = _this4.velocityStepShader.dt;
			_this5.dirty = true;
			_this5.data = dt;
			let _this6 = _this4.velocityStepShader.positionData;
			_this6.dirty = true;
			_this6.data = _this4.positionData.readFromTexture;
			let _this7 = _this4.velocityStepShader.velocityData;
			_this7.dirty = true;
			_this7.data = _this4.velocityData.readFromTexture;
			let shader = _this4.velocityStepShader;
			let target = _this4.velocityData;
			flu_modules_opengl_web_GL.current_context.viewport(0,0,target.width,target.height);
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target.writeFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this4.textureQuad);
			if(shader._active) {
				let _g = 0;
				let _g1 = shader._uniforms;
				while(_g < _g1.length) {
					let u = _g1[_g];
					++_g;
					u.apply();
				}
				let offset = 0;
				let _g11 = 0;
				let _g2 = shader._attributes.length;
				while(_g11 < _g2) {
					let i = _g11++;
					let att = shader._attributes[i];
					let location = att.location;
					if(location != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
					}
					offset += att.byteSize;
				}
				null;
			} else {
				if(!shader._ready) shader.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
				let _g3 = 0;
				let _g12 = shader._uniforms;
				while(_g3 < _g12.length) {
					let u1 = _g12[_g3];
					++_g3;
					u1.apply();
				}
				let offset1 = 0;
				let _g13 = 0;
				let _g4 = shader._attributes.length;
				while(_g13 < _g4) {
					let i1 = _g13++;
					let att1 = shader._attributes[i1];
					let location1 = att1.location;
					if(location1 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
					}
					offset1 += att1.byteSize;
				}
				shader._active = true;
			}
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader.deactivate();
			target.tmpFBO = target.writeFrameBufferObject;
			target.writeFrameBufferObject = target.readFrameBufferObject;
			target.readFrameBufferObject = target.tmpFBO;
			target.tmpTex = target.writeToTexture;
			target.writeToTexture = target.readFromTexture;
			target.readFromTexture = target.tmpTex;
			let _this8 = _this4.positionStepShader.dt;
			_this8.dirty = true;
			_this8.data = dt;
			let _this9 = _this4.positionStepShader.positionData;
			_this9.dirty = true;
			_this9.data = _this4.positionData.readFromTexture;
			let _this10 = _this4.positionStepShader.velocityData;
			_this10.dirty = true;
			_this10.data = _this4.velocityData.readFromTexture;
			let shader1 = _this4.positionStepShader;
			let target1 = _this4.positionData;
			flu_modules_opengl_web_GL.current_context.viewport(0,0,target1.width,target1.height);
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target1.writeFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this4.textureQuad);
			if(shader1._active) {
				let _g5 = 0;
				let _g14 = shader1._uniforms;
				while(_g5 < _g14.length) {
					let u2 = _g14[_g5];
					++_g5;
					u2.apply();
				}
				let offset2 = 0;
				let _g15 = 0;
				let _g6 = shader1._attributes.length;
				while(_g15 < _g6) {
					let i2 = _g15++;
					let att2 = shader1._attributes[i2];
					let location2 = att2.location;
					if(location2 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
					}
					offset2 += att2.byteSize;
				}
				null;
			} else {
				if(!shader1._ready) shader1.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
				let _g7 = 0;
				let _g16 = shader1._uniforms;
				while(_g7 < _g16.length) {
					let u3 = _g16[_g7];
					++_g7;
					u3.apply();
				}
				let offset3 = 0;
				let _g17 = 0;
				let _g8 = shader1._attributes.length;
				while(_g17 < _g8) {
					let i3 = _g17++;
					let att3 = shader1._attributes[i3];
					let location3 = att3.location;
					if(location3 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
					}
					offset3 += att3.byteSize;
				}
				shader1._active = true;
			}
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader1.deactivate();
			target1.tmpFBO = target1.writeFrameBufferObject;
			target1.writeFrameBufferObject = target1.readFrameBufferObject;
			target1.readFrameBufferObject = target1.tmpFBO;
			target1.tmpTex = target1.writeToTexture;
			target1.writeToTexture = target1.readFromTexture;
			target1.readFromTexture = target1.tmpTex;
		}
		if(this.hueCycleEnabled) {
			let _g9 = this.dyeColorHSB;
			_g9.set_hue(_g9.get_hue() + 1.2);
		}
		
		if(this.isMouseDown && !this.TWILIGHT && !this.SEX_BOMB && !this.BIG_BLUE && !this.THINK_PINK && !this.AVOBATH && !this.CHEER_UP_BUTTERCUP && !this.SECRET_ARTS && !this.BIG_SLEEP && !this.THE_EXPERIMENTOR && !this.INTERGALACTIC) {
			if(this.hueCycleEnabled) {
				
				let vx = (this.mouse.x - this.lastMouse.x) / (dt * this.window.width);
				let vy = (this.mouse.y - this.lastMouse.y) / (dt * this.window.height);
				let _g10 = this.dyeColorHSB;
				_g10.set_hue(_g10.get_hue() + Math.sqrt(vx * vx + vy * vy) * 0.5);
			}
			let rgb = this.dyeColorHSB.toRGB();
			let _this11 = this.dyeColor;

			//shoot fluid color configuration - modify later.
			let x = 160 / 255;
			let y = 32 / 255;
			let z = 240 / 255;
			_this11.x = x;
			_this11.y = y;
			_this11.z = z;
		}

		let _this22 = this.lastMouse;
		_this22.x = this.mouse.x;
		_this22.y = this.mouse.y;
		let _this23 = this.lastMouseFluid;
		_this23.x = (this.mouse.x / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this23.y = (this.window.height - this.mouse.y) / this.window.height * 2 - 1;
		this.lastMousePointKnown = this.mousePointKnown;
	}
	,render: function(w) {
		flu_modules_opengl_web_GL.current_context.viewport(0,0,this.window.width,this.window.height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.screenBuffer);
		let shader = this.blitTextureShader;
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.textureQuad);
		let _this = shader.texture;
		_this.dirty = true;
		_this.data = this.fluid.dyeRenderTarget.readFromTexture;
		shader.activate(true,true);
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader.deactivate();
		if(this.renderParticlesEnabled) {
			let shader1 = this.renderParticlesShader;
			flu_modules_opengl_web_GL.current_context.bindBuffer(34962,this.particles.particleUVs);
			let _this1 = shader1.positionData;
			_this1.dirty = true;
			_this1.data = this.particles.positionData.readFromTexture;
			let _this2 = shader1.velocityData;
			_this2.dirty = true;
			_this2.data = this.particles.velocityData.readFromTexture;
			shader1.activate(true,true);
			flu_modules_opengl_web_GL.current_context.drawArrays(0,0,this.particles.count);
			shader1.deactivate();
		}
	}
	,updateSimulationTextures: function() {
		let w;
		let h;
		w = Math.round(this.window.width * this.fluidScale);
		h = Math.round(this.window.height * this.fluidScale);
		if(w != this.fluid.width || h != this.fluid.height) {
			let _this = this.fluid;
			_this.velocityRenderTarget.resize(w,h);
			_this.pressureRenderTarget.resize(w,h);
			let _this1 = _this.divergenceRenderTarget;
			let newTexture = _this1.textureFactory(w,h);
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this1.frameBufferObject);
			flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,newTexture,0);
			if(_this1.texture != null) {
				let resampler = gltoolbox_shaders_Resample.instance;
				let _this2 = resampler.texture;
				_this2.dirty = true;
				_this2.data = _this1.texture;
				flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this1.frameBufferObject);
				flu_modules_opengl_web_GL.current_context.viewport(0,0,w,h);
				flu_modules_opengl_web_GL.current_context.bindBuffer(34962,gltoolbox_render_RenderTarget.textureQuad);
				if(resampler._active) {
					let _g = 0;
					let _g1 = resampler._uniforms;
					while(_g < _g1.length) {
						let u = _g1[_g];
						++_g;
						u.apply();
					}
					let offset = 0;
					let _g11 = 0;
					let _g2 = resampler._attributes.length;
					while(_g11 < _g2) {
						let i = _g11++;
						let att = resampler._attributes[i];
						let location = att.location;
						if(location != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,resampler._aStride,offset);
						}
						offset += att.byteSize;
					}
				} else {
					if(!resampler._ready) resampler.create();
					flu_modules_opengl_web_GL.current_context.useProgram(resampler._prog);
					let _g3 = 0;
					let _g12 = resampler._uniforms;
					while(_g3 < _g12.length) {
						let u1 = _g12[_g3];
						++_g3;
						u1.apply();
					}
					let offset1 = 0;
					let _g13 = 0;
					let _g4 = resampler._attributes.length;
					while(_g13 < _g4) {
						let i1 = _g13++;
						let att1 = resampler._attributes[i1];
						let location1 = att1.location;
						if(location1 != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,resampler._aStride,offset1);
						}
						offset1 += att1.byteSize;
					}
					resampler._active = true;
				}
				flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
				resampler.deactivate();
				flu_modules_opengl_web_GL.current_context.deleteTexture(_this1.texture);
			} else {
				flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this1.frameBufferObject);
				flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
				flu_modules_opengl_web_GL.current_context.clear(16384);
			}
			_this1.width = w;
			_this1.height = h;
			_this1.texture = newTexture;
			_this.dyeRenderTarget.resize(w,h);
			_this.width = w;
			_this.height = h;
			_this.aspectRatio = w / h;
			_this.updateAllCoreShaderUniforms();
		}
		if(this.particleCount != this.particles.count) this.particles.setCount(this.particleCount);
		this.particles.velocityStepShader.flowScale.data.x = 1 / (this.fluid.cellSize * this.fluid.aspectRatio);
		this.particles.velocityStepShader.flowScale.data.y = 1 / this.fluid.cellSize;
		let _this3 = this.particles.velocityStepShader.dragCoefficient;
		_this3.dirty = true;
		_this3.data = 1;
	}
	,updatePointSize: function() {
		this.renderParticlesShader.set_POINT_SIZE((this.pointSize | 0) + ".0");
	}
	,set_simulationQuality: function(quality) {
		switch(quality[1]) {
		case 0:
			this.particleCount = 1048576;
			this.fluidScale = 0.5;
			this.set_fluidIterations(30);
			this.offScreenScale = 1.;
			this.offScreenFilter = 9728;
			break;
		case 1:
			this.particleCount = 1048576;
			this.fluidScale = 0.25;
			this.set_fluidIterations(20);
			this.offScreenScale = 1.;
			this.offScreenFilter = 9728;
			break;
		case 2:
			this.particleCount = 262144;
			this.fluidScale = 0.25;
			this.set_fluidIterations(18);
			this.offScreenScale = 0.5;
			this.offScreenFilter = 9729;
			break;
		case 3:
			this.particleCount = 65536;
			this.fluidScale = 0.2;
			this.set_fluidIterations(14);
			this.offScreenScale = 0.25;
			this.offScreenFilter = 9729;
			this.pointSize = 2;
			break;
		case 4:
			this.particleCount = 16384;
			this.fluidScale = 0.16666666666666666;
			this.set_fluidIterations(12);
			this.offScreenScale = 0.25;
			this.offScreenFilter = 9729;
			this.pointSize = 2;
			break;
		case 5:
			this.particleCount = 16384;
			this.fluidScale = 0.1;
			this.set_fluidIterations(6);
			this.offScreenScale = 0.25;
			this.offScreenFilter = 9729;
			this.pointSize = 2;
			break;
		case 6:
			this.particleCount = 4096;
			this.fluidScale = 0.0625;
			this.set_fluidIterations(5);
			this.offScreenScale = 0.25;
			this.offScreenFilter = 9729;
			this.pointSize = 2;
			break;
		}
		this.renderParticlesEnabled = this.particleCount > 1;
		return this.simulationQuality = quality;
	}
	,set_fluidIterations: function(v) {
		this.fluidIterations = v;
		if(this.fluid != null) this.fluid.solverIterations = v;
		return v;
	}
	,lowerQualityRequired: function(magnitude) {
		if(this.qualityDirection > 0) return;
		this.qualityDirection = -1;
		let qualityIndex = this.simulationQuality[1];
		let maxIndex = Type.allEnums(SimulationQuality).length - 1;
		if(qualityIndex >= maxIndex) return;
		if(magnitude < 0.5) qualityIndex += 1; else qualityIndex += 2;
		if(qualityIndex > maxIndex) qualityIndex = maxIndex;
		let newQuality = Type.createEnumIndex(SimulationQuality,qualityIndex);
		//console.log("Average FPS: " + this.performanceMonitor.fpsSample.average + ", lowering quality to: " + Std.string(newQuality));
		this.set_simulationQuality(newQuality);
		this.updateSimulationTextures();
		this.updatePointSize();
	}
	,reset: function() {
		let _this = this.particles;
		let shader = _this.initialPositionShader;
		let target = _this.positionData;
		flu_modules_opengl_web_GL.current_context.viewport(0,0,target.width,target.height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this.textureQuad);
		if(shader._active) {
			let _g = 0;
			let _g1 = shader._uniforms;
			while(_g < _g1.length) {
				let u = _g1[_g];
				++_g;
				u.apply();
			}
			let offset = 0;
			let _g11 = 0;
			let _g2 = shader._attributes.length;
			while(_g11 < _g2) {
				let i = _g11++;
				let att = shader._attributes[i];
				let location = att.location;
				if(location != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
				}
				offset += att.byteSize;
			}
		} else {
			if(!shader._ready) shader.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
			let _g3 = 0;
			let _g12 = shader._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = shader._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = shader._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
			shader._active = true;
		}
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader.deactivate();
		target.tmpFBO = target.writeFrameBufferObject;
		target.writeFrameBufferObject = target.readFrameBufferObject;
		target.readFrameBufferObject = target.tmpFBO;
		target.tmpTex = target.writeToTexture;
		target.writeToTexture = target.readFromTexture;
		target.readFromTexture = target.tmpTex;
		let shader1 = _this.initialVelocityShader;
		let target1 = _this.velocityData;
		flu_modules_opengl_web_GL.current_context.viewport(0,0,target1.width,target1.height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target1.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this.textureQuad);
		if(shader1._active) {
			let _g5 = 0;
			let _g14 = shader1._uniforms;
			while(_g5 < _g14.length) {
				let u2 = _g14[_g5];
				++_g5;
				u2.apply();
			}
			let offset2 = 0;
			let _g15 = 0;
			let _g6 = shader1._attributes.length;
			while(_g15 < _g6) {
				let i2 = _g15++;
				let att2 = shader1._attributes[i2];
				let location2 = att2.location;
				if(location2 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
				}
				offset2 += att2.byteSize;
			}
		} else {
			if(!shader1._ready) shader1.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
			let _g7 = 0;
			let _g16 = shader1._uniforms;
			while(_g7 < _g16.length) {
				let u3 = _g16[_g7];
				++_g7;
				u3.apply();
			}
			let offset3 = 0;
			let _g17 = 0;
			let _g8 = shader1._attributes.length;
			while(_g17 < _g8) {
				let i3 = _g17++;
				let att3 = shader1._attributes[i3];
				let location3 = att3.location;
				if(location3 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
				}
				offset3 += att3.byteSize;
			}
			shader1._active = true;
		}
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader1.deactivate();
		target1.tmpFBO = target1.writeFrameBufferObject;
		target1.writeFrameBufferObject = target1.readFrameBufferObject;
		target1.readFrameBufferObject = target1.tmpFBO;
		target1.tmpTex = target1.writeToTexture;
		target1.writeToTexture = target1.readFromTexture;
		target1.readFromTexture = target1.tmpTex;
		let _this1 = this.fluid;
		flu_modules_opengl_web_GL.current_context.viewport(0,0,_this1.width,_this1.height);
		flu_modules_opengl_web_GL.current_context.disable(3042);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this1.textureQuad);
		let shader2 = _this1.clearVelocityShader;
		if(shader2._active) {
			let _g9 = 0;
			let _g18 = shader2._uniforms;
			while(_g9 < _g18.length) {
				let u4 = _g18[_g9];
				++_g9;
				u4.apply();
			}
			let offset4 = 0;
			let _g19 = 0;
			let _g10 = shader2._attributes.length;
			while(_g19 < _g10) {
				let i4 = _g19++;
				let att4 = shader2._attributes[i4];
				let location4 = att4.location;
				if(location4 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location4);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location4,att4.itemCount,att4.type,false,shader2._aStride,offset4);
				}
				offset4 += att4.byteSize;
			}
		} else {
			if(!shader2._ready) shader2.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader2._prog);
			let _g20 = 0;
			let _g110 = shader2._uniforms;
			while(_g20 < _g110.length) {
				let u5 = _g110[_g20];
				++_g20;
				u5.apply();
			}
			let offset5 = 0;
			let _g111 = 0;
			let _g21 = shader2._attributes.length;
			while(_g111 < _g21) {
				let i5 = _g111++;
				let att5 = shader2._attributes[i5];
				let location5 = att5.location;
				if(location5 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location5);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location5,att5.itemCount,att5.type,false,shader2._aStride,offset5);
				}
				offset5 += att5.byteSize;
			}
			shader2._active = true;
		}
		_this1.velocityRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader2.deactivate();
		let _this2 = _this1.velocityRenderTarget;
		_this2.tmpFBO = _this2.writeFrameBufferObject;
		_this2.writeFrameBufferObject = _this2.readFrameBufferObject;
		_this2.readFrameBufferObject = _this2.tmpFBO;
		_this2.tmpTex = _this2.writeToTexture;
		_this2.writeToTexture = _this2.readFromTexture;
		_this2.readFromTexture = _this2.tmpTex;
		let shader3 = _this1.clearPressureShader;
		if(shader3._active) {
			let _g22 = 0;
			let _g112 = shader3._uniforms;
			while(_g22 < _g112.length) {
				let u6 = _g112[_g22];
				++_g22;
				u6.apply();
			}
			let offset6 = 0;
			let _g113 = 0;
			let _g23 = shader3._attributes.length;
			while(_g113 < _g23) {
				let i6 = _g113++;
				let att6 = shader3._attributes[i6];
				let location6 = att6.location;
				if(location6 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location6);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location6,att6.itemCount,att6.type,false,shader3._aStride,offset6);
				}
				offset6 += att6.byteSize;
			}
		} else {
			if(!shader3._ready) shader3.create();
			flu_modules_opengl_web_GL.current_context.useProgram(shader3._prog);
			let _g24 = 0;
			let _g114 = shader3._uniforms;
			while(_g24 < _g114.length) {
				let u7 = _g114[_g24];
				++_g24;
				u7.apply();
			}
			let offset7 = 0;
			let _g115 = 0;
			let _g25 = shader3._attributes.length;
			while(_g115 < _g25) {
				let i7 = _g115++;
				let att7 = shader3._attributes[i7];
				let location7 = att7.location;
				if(location7 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location7);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location7,att7.itemCount,att7.type,false,shader3._aStride,offset7);
				}
				offset7 += att7.byteSize;
			}
			shader3._active = true;
		}
		_this1.pressureRenderTarget.activate();
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		shader3.deactivate();
		let _this3 = _this1.pressureRenderTarget;
		_this3.tmpFBO = _this3.writeFrameBufferObject;
		_this3.writeFrameBufferObject = _this3.readFrameBufferObject;
		_this3.readFrameBufferObject = _this3.tmpFBO;
		_this3.tmpTex = _this3.writeToTexture;
		_this3.writeToTexture = _this3.readFromTexture;
		_this3.readFromTexture = _this3.tmpTex;
		let _this4 = _this1.dyeRenderTarget;
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this4.readFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
		flu_modules_opengl_web_GL.current_context.clear(16384);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this4.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
		flu_modules_opengl_web_GL.current_context.clear(16384);
		this.HAS_RUN = false;
	}
	,onmousedown: function(x,y,button,_,_1) {
		this.isMouseDown = true;
		this.hueCycleEnabled = true;
	}
	,onmouseup: function(x,y,button,_,_1) {
		let _g = this;
		this.timer.run = function() {
			_g.isMouseDown = false;
			_g.HAS_RUN = false;
		};
	}
	,onmousemove: function(x,y,xrel,yrel,_,_1) {
		let _this = this.mouse;
		_this.x = x;
		_this.y = y;
		let _this1 = this.mouseFluid;
		_this1.x = (x / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this1.y = (this.window.height - y) / this.window.height * 2 - 1;
		this.mousePointKnown = true;
	}
	,ontouchdown: function(x,y,touch_id,_) {
		let x1 = x;
		let y1 = y;
		x1 = x * this.window.width;
		y1 = y * this.window.height;
		let _this = this.mouse;
		_this.x = x1;
		_this.y = y1;
		let _this1 = this.mouseFluid;
		_this1.x = (x1 / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this1.y = (this.window.height - y1) / this.window.height * 2 - 1;
		this.mousePointKnown = true;
		let _this2 = this.lastMouse;
		_this2.x = this.mouse.x;
		_this2.y = this.mouse.y;
		let _this3 = this.lastMouseFluid;
		_this3.x = (this.mouse.x / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this3.y = (this.window.height - this.mouse.y) / this.window.height * 2 - 1;
		this.lastMousePointKnown = this.mousePointKnown;
		this.isMouseDown = true;
		this.hueCycleEnabled = true;
	}
	,ontouchup: function(x,y,touch_id,_) {
		let _g = this;
		let x1 = x;
		let y1 = y;
		x1 = x * this.window.width;
		y1 = y * this.window.height;
		let _this = this.mouse;
		_this.x = x1;
		_this.y = y1;
		let _this1 = this.mouseFluid;
		_this1.x = (x1 / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this1.y = (this.window.height - y1) / this.window.height * 2 - 1;
		this.mousePointKnown = true;
		this.timer.run = function() {
			_g.isMouseDown = false;
			_g.HAS_RUN = false;
		};
	}
	,ontouchmove: function(x,y,dx,dy,touch_id,_) {
		let x1 = x;
		let y1 = y;
		x1 = x * this.window.width;
		y1 = y * this.window.height;
		let _this = this.mouse;
		_this.x = x1;
		_this.y = y1;
		let _this1 = this.mouseFluid;
		_this1.x = (x1 / this.window.width * 2 - 1) * this.fluid.aspectRatio;
		_this1.y = (this.window.height - y1) / this.window.height * 2 - 1;
		this.mousePointKnown = true;
	}
	,onkeydown: function(keyCode,_,_1,_2,_3,_4) {
		switch(keyCode) {
		case flu_system_input_Keycodes.from_scan(flu_system_input_Scancodes.lshift):
			this.lshiftDown = true;
			break;
		case flu_system_input_Keycodes.from_scan(flu_system_input_Scancodes.rshift):
			this.rshiftDown = true;
			break;
		}
	}
	,onkeyup: function(keyCode,_,_1,_2,_3,_4) {
		switch(keyCode) {
		case 114:
			if(this.lshiftDown || this.rshiftDown) {
				let _this = this.particles;
				let shader = _this.initialPositionShader;
				let target = _this.positionData;
				flu_modules_opengl_web_GL.current_context.viewport(0,0,target.width,target.height);
				flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target.writeFrameBufferObject);
				flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this.textureQuad);
				if(shader._active) {
					let _g = 0;
					let _g1 = shader._uniforms;
					while(_g < _g1.length) {
						let u = _g1[_g];
						++_g;
						u.apply();
					}
					let offset = 0;
					let _g11 = 0;
					let _g2 = shader._attributes.length;
					while(_g11 < _g2) {
						let i = _g11++;
						let att = shader._attributes[i];
						let location = att.location;
						if(location != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,shader._aStride,offset);
						}
						offset += att.byteSize;
					}
				} else {
					if(!shader._ready) shader.create();
					flu_modules_opengl_web_GL.current_context.useProgram(shader._prog);
					let _g3 = 0;
					let _g12 = shader._uniforms;
					while(_g3 < _g12.length) {
						let u1 = _g12[_g3];
						++_g3;
						u1.apply();
					}
					let offset1 = 0;
					let _g13 = 0;
					let _g4 = shader._attributes.length;
					while(_g13 < _g4) {
						let i1 = _g13++;
						let att1 = shader._attributes[i1];
						let location1 = att1.location;
						if(location1 != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,shader._aStride,offset1);
						}
						offset1 += att1.byteSize;
					}
					shader._active = true;
				}
				flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
				shader.deactivate();
				target.tmpFBO = target.writeFrameBufferObject;
				target.writeFrameBufferObject = target.readFrameBufferObject;
				target.readFrameBufferObject = target.tmpFBO;
				target.tmpTex = target.writeToTexture;
				target.writeToTexture = target.readFromTexture;
				target.readFromTexture = target.tmpTex;
				let shader1 = _this.initialVelocityShader;
				let target1 = _this.velocityData;
				flu_modules_opengl_web_GL.current_context.viewport(0,0,target1.width,target1.height);
				flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,target1.writeFrameBufferObject);
				flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this.textureQuad);
				if(shader1._active) {
					let _g5 = 0;
					let _g14 = shader1._uniforms;
					while(_g5 < _g14.length) {
						let u2 = _g14[_g5];
						++_g5;
						u2.apply();
					}
					let offset2 = 0;
					let _g15 = 0;
					let _g6 = shader1._attributes.length;
					while(_g15 < _g6) {
						let i2 = _g15++;
						let att2 = shader1._attributes[i2];
						let location2 = att2.location;
						if(location2 != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location2);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location2,att2.itemCount,att2.type,false,shader1._aStride,offset2);
						}
						offset2 += att2.byteSize;
					}
				} else {
					if(!shader1._ready) shader1.create();
					flu_modules_opengl_web_GL.current_context.useProgram(shader1._prog);
					let _g7 = 0;
					let _g16 = shader1._uniforms;
					while(_g7 < _g16.length) {
						let u3 = _g16[_g7];
						++_g7;
						u3.apply();
					}
					let offset3 = 0;
					let _g17 = 0;
					let _g8 = shader1._attributes.length;
					while(_g17 < _g8) {
						let i3 = _g17++;
						let att3 = shader1._attributes[i3];
						let location3 = att3.location;
						if(location3 != -1) {
							flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location3);
							flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location3,att3.itemCount,att3.type,false,shader1._aStride,offset3);
						}
						offset3 += att3.byteSize;
					}
					shader1._active = true;
				}
				flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
				shader1.deactivate();
				target1.tmpFBO = target1.writeFrameBufferObject;
				target1.writeFrameBufferObject = target1.readFrameBufferObject;
				target1.readFrameBufferObject = target1.tmpFBO;
				target1.tmpTex = target1.writeToTexture;
				target1.writeToTexture = target1.readFromTexture;
				target1.readFromTexture = target1.tmpTex;
			} else this.reset();
			break;
		case 112:
			this.renderParticlesEnabled = !this.renderParticlesEnabled;
			break;
		case 100:
			this.renderFluidEnabled = !this.renderFluidEnabled;
			break;
		case 115:
			let _this1 = this.fluid;
			flu_modules_opengl_web_GL.current_context.viewport(0,0,_this1.width,_this1.height);
			flu_modules_opengl_web_GL.current_context.disable(3042);
			flu_modules_opengl_web_GL.current_context.bindBuffer(34962,_this1.textureQuad);
			let shader2 = _this1.clearVelocityShader;
			if(shader2._active) {
				let _g9 = 0;
				let _g18 = shader2._uniforms;
				while(_g9 < _g18.length) {
					let u4 = _g18[_g9];
					++_g9;
					u4.apply();
				}
				let offset4 = 0;
				let _g19 = 0;
				let _g10 = shader2._attributes.length;
				while(_g19 < _g10) {
					let i4 = _g19++;
					let att4 = shader2._attributes[i4];
					let location4 = att4.location;
					if(location4 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location4);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location4,att4.itemCount,att4.type,false,shader2._aStride,offset4);
					}
					offset4 += att4.byteSize;
				}
			} else {
				if(!shader2._ready) shader2.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader2._prog);
				let _g20 = 0;
				let _g110 = shader2._uniforms;
				while(_g20 < _g110.length) {
					let u5 = _g110[_g20];
					++_g20;
					u5.apply();
				}
				let offset5 = 0;
				let _g111 = 0;
				let _g21 = shader2._attributes.length;
				while(_g111 < _g21) {
					let i5 = _g111++;
					let att5 = shader2._attributes[i5];
					let location5 = att5.location;
					if(location5 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location5);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location5,att5.itemCount,att5.type,false,shader2._aStride,offset5);
					}
					offset5 += att5.byteSize;
				}
				shader2._active = true;
			}
			_this1.velocityRenderTarget.activate();
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader2.deactivate();
			let _this2 = _this1.velocityRenderTarget;
			_this2.tmpFBO = _this2.writeFrameBufferObject;
			_this2.writeFrameBufferObject = _this2.readFrameBufferObject;
			_this2.readFrameBufferObject = _this2.tmpFBO;
			_this2.tmpTex = _this2.writeToTexture;
			_this2.writeToTexture = _this2.readFromTexture;
			_this2.readFromTexture = _this2.tmpTex;
			let shader3 = _this1.clearPressureShader;
			if(shader3._active) {
				let _g22 = 0;
				let _g112 = shader3._uniforms;
				while(_g22 < _g112.length) {
					let u6 = _g112[_g22];
					++_g22;
					u6.apply();
				}
				let offset6 = 0;
				let _g113 = 0;
				let _g23 = shader3._attributes.length;
				while(_g113 < _g23) {
					let i6 = _g113++;
					let att6 = shader3._attributes[i6];
					let location6 = att6.location;
					if(location6 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location6);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location6,att6.itemCount,att6.type,false,shader3._aStride,offset6);
					}
					offset6 += att6.byteSize;
				}
			} else {
				if(!shader3._ready) shader3.create();
				flu_modules_opengl_web_GL.current_context.useProgram(shader3._prog);
				let _g24 = 0;
				let _g114 = shader3._uniforms;
				while(_g24 < _g114.length) {
					let u7 = _g114[_g24];
					++_g24;
					u7.apply();
				}
				let offset7 = 0;
				let _g115 = 0;
				let _g25 = shader3._attributes.length;
				while(_g115 < _g25) {
					let i7 = _g115++;
					let att7 = shader3._attributes[i7];
					let location7 = att7.location;
					if(location7 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location7);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location7,att7.itemCount,att7.type,false,shader3._aStride,offset7);
					}
					offset7 += att7.byteSize;
				}
				shader3._active = true;
			}
			_this1.pressureRenderTarget.activate();
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			shader3.deactivate();
			let _this3 = _this1.pressureRenderTarget;
			_this3.tmpFBO = _this3.writeFrameBufferObject;
			_this3.writeFrameBufferObject = _this3.readFrameBufferObject;
			_this3.readFrameBufferObject = _this3.tmpFBO;
			_this3.tmpTex = _this3.writeToTexture;
			_this3.writeToTexture = _this3.readFromTexture;
			_this3.readFromTexture = _this3.tmpTex;
			let _this4 = _this1.dyeRenderTarget;
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this4.readFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
			flu_modules_opengl_web_GL.current_context.clear(16384);
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,_this4.writeFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
			flu_modules_opengl_web_GL.current_context.clear(16384);
			break;
		case flu_system_input_Keycodes.from_scan(flu_system_input_Scancodes.lshift):
			this.lshiftDown = false;
			break;
		case flu_system_input_Keycodes.from_scan(flu_system_input_Scancodes.rshift):
			this.rshiftDown = false;
			break;
		}
	}
	,onWindowEvent: function(e) {
		let _g = e.type;
		if(_g != null) switch(_g) {
		case 6:
			this.updateSimulationTextures();
			this.lastMousePointKnown = false;
			this.mousePointKnown = false;
			this.isMouseDown = false;
			break;
		case 12:
			this.isMouseDown = false;
			break;
		case 11:
			this.mousePointKnown = false;
			this.lastMousePointKnown = false;
			break;
		default:
		} else {
		}
	}
	,__class__: Main
});
let SimulationQuality = $hxClasses["SimulationQuality"] = { __ename__ : true, __constructs__ : ["UltraHigh","High","Medium","Low","UltraLow","Android_IOS","UltraUltraLow"] };
SimulationQuality.UltraHigh = ["UltraHigh",0];
SimulationQuality.UltraHigh.toString = $estr;
SimulationQuality.UltraHigh.__enum__ = SimulationQuality;
SimulationQuality.High = ["High",1];
SimulationQuality.High.toString = $estr;
SimulationQuality.High.__enum__ = SimulationQuality;
SimulationQuality.Medium = ["Medium",2];
SimulationQuality.Medium.toString = $estr;
SimulationQuality.Medium.__enum__ = SimulationQuality;
SimulationQuality.Low = ["Low",3];
SimulationQuality.Low.toString = $estr;
SimulationQuality.Low.__enum__ = SimulationQuality;
SimulationQuality.UltraLow = ["UltraLow",4];
SimulationQuality.UltraLow.toString = $estr;
SimulationQuality.UltraLow.__enum__ = SimulationQuality;
SimulationQuality.Android_IOS = ["Android_IOS",5];
SimulationQuality.Android_IOS.toString = $estr;
SimulationQuality.Android_IOS.__enum__ = SimulationQuality;
SimulationQuality.UltraUltraLow = ["UltraUltraLow",6];
SimulationQuality.UltraUltraLow.toString = $estr;
SimulationQuality.UltraUltraLow.__enum__ = SimulationQuality;
SimulationQuality.__empty_constructs__ = [SimulationQuality.UltraHigh,SimulationQuality.High,SimulationQuality.Medium,SimulationQuality.Low,SimulationQuality.UltraLow,SimulationQuality.Android_IOS,SimulationQuality.UltraUltraLow];
let BlitTexture = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["BlitTexture"] = BlitTexture;
BlitTexture.__name__ = true;
BlitTexture.__super__ = shaderblox_ShaderBase;
BlitTexture.prototype = $extend(shaderblox_ShaderBase.prototype,{
	createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("texture",null,false);
		this.texture = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance1;
		this._attributes.push(instance1);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\r\nvarying vec2 texelCoord;\r\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nuniform sampler2D texture;\n\tvarying vec2 texelCoord;\n\n\tvoid main(void){\n\t\tgl_FragColor = texture2D(texture, texelCoord);\n\t}\n";
	}
	,__class__: BlitTexture
});
let FluidRender = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["FluidRender"] = FluidRender;
FluidRender.__name__ = true;
FluidRender.__super__ = shaderblox_ShaderBase;
FluidRender.prototype = $extend(shaderblox_ShaderBase.prototype,{
	createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("texture",null,false);
		this.texture = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance1;
		this._attributes.push(instance1);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\r\nvarying vec2 texelCoord;\r\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nuniform sampler2D texture;\n\tvarying vec2 texelCoord;\n\n\tvoid main(void){\n\t\tgl_FragColor = texture2D(texture, texelCoord);\n\t}\n";
	}
	,__class__: FluidRender
});
let ColorParticleMotion = function() {
	RenderParticles.call(this);
};
$hxClasses["ColorParticleMotion"] = ColorParticleMotion;
ColorParticleMotion.__name__ = true;
ColorParticleMotion.__super__ = RenderParticles;
ColorParticleMotion.prototype = $extend(RenderParticles.prototype,{
	set_POINT_SIZE: function(value) {
		this.POINT_SIZE = value;
		this._vertSource = shaderblox_glsl_GLSLTools.injectConstValue(this._vertSource,"POINT_SIZE",value);
		if(this._ready) this.destroy();
		return value;
	}
	,createProperties: function() {
		RenderParticles.prototype.createProperties.call(this);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_PARTICLE_VELOCITY_SCALE = 0.05; \n\r\nconst bool FLOAT_DATA = false;\r\n\r\n\nvec4 packParticlePosition(in vec2 p){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(p.xy, 0.0, 0.0);\r\n\t}else{\t\r\n\t    vec2 np = (p)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(np.x), packFloat8bitRG(np.y));\r\n\t}\r\n}\r\n\r\nvec2 unpackParticlePosition(in vec4 pp){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pp.xy;\r\n\t}else{\r\n\t    vec2 np = vec2(unpackFloat8bitRG(pp.xy), unpackFloat8bitRG(pp.zw));\r\n\t    return (2.0*np.xy - 1.0);\r\n\t}\r\n}\r\n\r\n\nvec4 packParticleVelocity(in vec2 v){\r\n\tif(FLOAT_DATA){\r\n\t\treturn vec4(v.xy, 0.0, 0.0);\r\n\t}else{\r\n\t    vec2 nv = (v * PACK_PARTICLE_VELOCITY_SCALE)*0.5 + 0.5;\r\n\t    return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n\t}\r\n\r\n}\r\n\r\nvec2 unpackParticleVelocity(in vec4 pv){\r\n\tif(FLOAT_DATA){\r\n\t\treturn pv.xy;\r\n\t}else{\r\n\t    const float INV_PACK_PARTICLE_VELOCITY_SCALE = 1./PACK_PARTICLE_VELOCITY_SCALE;\r\n\t    vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n\t    return (2.0*nv.xy - 1.0)* INV_PACK_PARTICLE_VELOCITY_SCALE;\r\n\t}\r\n}\n\n\tuniform sampler2D positionData;\n\tuniform sampler2D velocityData;\n\n\tattribute vec2 particleUV;\n\tvarying vec4 color;\n\t\n\n\nvec3 saturation(in vec3 rgb, in float amount){\n\t\tconst vec3 CW = vec3(0.299, 0.587, 0.114);\n\t\tvec3 bw = vec3(dot(rgb, CW));\n\t\treturn mix(bw, rgb, amount);\n\t}\n\n\tconst float POINT_SIZE = 1.0;\n\n\tvoid main(){\n\t\tvec2 p = unpackParticlePosition(texture2D(positionData, particleUV));\n\t\tvec2 v = unpackParticleVelocity(texture2D(velocityData, particleUV));\n\t\tgl_PointSize = 1.0;\n\t\tgl_Position = vec4(p, 0.0, 1.0);\n\t\tfloat speed = length(v);\n\t\tfloat x = clamp(speed * 4.0, 0., 1.);\n\t\tcolor.rgb = (\n\t\t\t\tmix(vec3(40.4, 0.0, 35.0) / 300.0, vec3(0.2, 47.8, 100) / 100.0, x)\n\t\t\t\t+ (vec3(63.1, 92.5, 100) / 100.) * x*x*x * .1\n\t\t);\n\t\tcolor.a = 1.0;\n\t}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nvarying vec4 color;\n\n\tvoid main(){\n\t\tgl_FragColor = vec4(color);\n\t}\n\n\n";
	}
	,__class__: ColorParticleMotion
});
let MouseDye = function() {
	UpdateDye.call(this);
};
$hxClasses["MouseDye"] = MouseDye;
MouseDye.__name__ = true;
MouseDye.__super__ = UpdateDye;
MouseDye.prototype = $extend(UpdateDye.prototype,{
	createProperties: function() {
		UpdateDye.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UBool("isMouseDown",null);
		this.isMouseDown = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UVec2("mouse",null);
		this.mouse = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UVec2("lastMouse",null);
		this.lastMouse = instance2;
		this._uniforms.push(instance2);
		let instance3 = new shaderblox_uniforms_UVec3("dyeColor",null);
		this.dyeColor = instance3;
		this._uniforms.push(instance3);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D dye;\n\tuniform float dt;\n\tuniform float dx;\n\n\tvarying vec2 texelCoord;\n\tvarying vec2 p;\n\n\nfloat distanceToSegment(vec2 a, vec2 b, vec2 p, out float fp){\r\n\tvec2 d = p - a;\r\n\tvec2 x = b - a;\r\n\r\n\tfp = 0.0; \n\tfloat lx = length(x);\r\n\t\r\n\tif(lx <= 0.0001) return length(d);\n\r\n\tfloat projection = dot(d, x / lx); \n\r\n\tfp = projection / lx;\r\n\r\n\tif(projection < 0.0)            return length(d);\r\n\telse if(projection > length(x)) return length(p - b);\r\n\treturn sqrt(abs(dot(d,d) - projection*projection));\r\n}\r\nfloat distanceToSegment(vec2 a, vec2 b, vec2 p){\r\n\tfloat fp;\r\n\treturn distanceToSegment(a, b, p, fp);\r\n}\n\tuniform bool isMouseDown;\n\tuniform vec2 mouse; \n\tuniform vec2 lastMouse;\n\tuniform vec3 dyeColor;\n\n\tvec3 saturation(in vec3 rgb, in float amount){\n\t\tconst vec3 CW = vec3(0.299, 0.587, 0.114);\n\t\tvec3 bw = vec3(dot(rgb, CW));\n\t\treturn mix(bw, rgb, amount);\n\t}\n\n\tvoid main(){\n\t\tvec4 color = texture2D(dye, texelCoord);\n\t\t\n\t\tcolor -= sign(color)*(0.006 - (1.0 - color)*0.004);\n\t\t\n\n\t\t\n\t\t\n\n\t\tif(isMouseDown){\t\t\t\n\t\t\tvec2 mouseVelocity = (mouse - lastMouse)/dt;\n\t\t\t\n\t\t\t\n\t\t\tfloat projection;\n\t\t\tfloat l = distanceToSegment(mouse, lastMouse, p, projection);\n\t\t\tfloat taperFactor = 0.6;\n\t\t\tfloat projectedFraction = 1.0 - clamp(projection, 0.0, 1.0)*taperFactor;\n\n\t\t\tfloat speed = 0.016*length(mouseVelocity)/dt;\n\t\t\tfloat x = speed;\n\t\t\t\t\t\t\t\t\t\n\t\t\tfloat R = 0.3;\n\t\t\tfloat m = 1.0*exp(-l/R);\n\t\t\tfloat m2 = m*m;\n\t\t\tfloat m3 = m2*m;\n\t\t\tfloat m4 = m3*m;\n\t\t\tfloat m6 = m4*m*m;\n\n\t\t\tcolor.rgb +=\n\t\t\t\t0.004*dyeColor*(16.0*m3*(0.5*x+1.0)+m2) \n\t\t\t  + 0.03*m6*m*m*vec3(1.0)*(0.5*m3*x + 1.0);     \n\t\t}\n\n\t\tgl_FragColor = color;\n\t}\n";
	}
	,__class__: MouseDye
});
let MouseForce = function() {
	ApplyForces.call(this);
};
$hxClasses["MouseForce"] = MouseForce;
MouseForce.__name__ = true;
MouseForce.__super__ = ApplyForces;
MouseForce.prototype = $extend(ApplyForces.prototype,{
	createProperties: function() {
		ApplyForces.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UBool("isMouseDown",null);
		this.isMouseDown = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UVec2("mouse",null);
		this.mouse = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UVec2("lastMouse",null);
		this.lastMouse = instance2;
		this._uniforms.push(instance2);
		this._aStride += 0;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\nattribute vec2 vertexPosition;\r\n\r\nuniform float aspectRatio;\r\n\r\nvarying vec2 texelCoord;\r\n\r\n\r\nvarying vec2 p;\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\t\r\n\tvec2 clipSpace = 2.0*texelCoord - 1.0;\t\n\t\r\n\tp = vec2(clipSpace.x * aspectRatio, clipSpace.y);\r\n\r\n\tgl_Position = vec4(clipSpace, 0.0, 1.0 );\t\r\n}\r\n\n\n\n\n\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\nuniform sampler2D velocity;\n\tuniform float dt;\n\tuniform float dx;\n\n\tvarying vec2 texelCoord;\n\tvarying vec2 p;\n\n\nfloat distanceToSegment(vec2 a, vec2 b, vec2 p, out float fp){\r\n\tvec2 d = p - a;\r\n\tvec2 x = b - a;\r\n\r\n\tfp = 0.0; \n\tfloat lx = length(x);\r\n\t\r\n\tif(lx <= 0.0001) return length(d);\n\r\n\tfloat projection = dot(d, x / lx); \n\r\n\tfp = projection / lx;\r\n\r\n\tif(projection < 0.0)            return length(d);\r\n\telse if(projection > length(x)) return length(p - b);\r\n\treturn sqrt(abs(dot(d,d) - projection*projection));\r\n}\r\nfloat distanceToSegment(vec2 a, vec2 b, vec2 p){\r\n\tfloat fp;\r\n\treturn distanceToSegment(a, b, p, fp);\r\n}\nfloat rand(vec2 co){\r\n\treturn fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n}\n\tuniform bool isMouseDown;\n\tuniform vec2 mouse; \n\tuniform vec2 lastMouse;\n\n\tvoid main(){\n\t\tvec2 v = sampleVelocity(velocity, texelCoord);\n\t\t\n\t\t\n\t\tv *= 0.999;\n\t\tif(isMouseDown){\n\t\t\tvec2 mouseVelocity = -(lastMouse - mouse)/dt;\n\t\t\t\n\t\t\t\t\n\t\t\t\n\t\t\tfloat projection;\n\t\t\tfloat l = distanceToSegment(mouse, lastMouse, p, projection);\n\t\t\tfloat taperFactor = 0.6;\n\t\t\t\n\t\t\t\n\t\t\tfloat projectedFraction = 2.3 - clamp(projection, 0.0, 1.0) * taperFactor;\n\t\t\t\n\t\t\tfloat R = 0.010;\n\t\t\tfloat m = exp(-l/R); \n\t\t\tm *= projectedFraction * projectedFraction;\n\t\t\t\n\t\t\tvec2 targetVelocity = mouseVelocity * 1.4;\n\n\t\t\tv += (targetVelocity - v)*(m + m*m*m*8.0)*(0.2);\n\t\t}\n\n\t\t\n\t\t\n\n\t\tgl_FragColor = packFluidVelocity(v);\n\t}\n";
	}
	,__class__: MouseForce
});
let DebugBlitTexture = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["DebugBlitTexture"] = DebugBlitTexture;
DebugBlitTexture.__name__ = true;
DebugBlitTexture.__super__ = shaderblox_ShaderBase;
DebugBlitTexture.prototype = $extend(shaderblox_ShaderBase.prototype,{
	createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UVec2("invresolution",null);
		this.invresolution = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_uniforms_UFloat("aspectRatio",null);
		this.aspectRatio = instance1;
		this._uniforms.push(instance1);
		let instance2 = new shaderblox_uniforms_UTexture("texture",null,false);
		this.texture = instance2;
		this._uniforms.push(instance2);
		let instance3 = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance3;
		this._attributes.push(instance3);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\r\nvarying vec2 texelCoord;\r\n\r\nvoid main() {\r\n\ttexelCoord = vertexPosition;\r\n\tgl_Position = vec4(vertexPosition*2.0 - vec2(1.0, 1.0), 0.0, 1.0 );\n}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\n\r\n\r\n#define PRESSURE_BOUNDARY\r\n#define VELOCITY_BOUNDARY\r\n\r\nuniform vec2 invresolution;\r\nuniform float aspectRatio;\r\n\r\nvec2 clipToAspectSpace(in vec2 p){\r\n    return vec2(p.x * aspectRatio, p.y);\r\n}\r\n\r\nvec2 aspectToTexelSpace(in vec2 p){\r\n    return vec2(p.x / aspectRatio + 1.0 , p.y + 1.0)*.5;\r\n}\r\n\r\n\n#define FLOAT_PACKING_LIB\r\n\r\n\nvec4 packFloat8bitRGBA(in float val) {\r\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec4(pack.yzw / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGBA(in vec4 pack) {\r\n    return dot(pack, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\r\n}\r\n\r\nvec3 packFloat8bitRGB(in float val) {\r\n    vec3 pack = vec3(1.0, 255.0, 65025.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec3(pack.yz / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRGB(in vec3 pack) {\r\n    return dot(pack, vec3(1.0, 1.0 / 255.0, 1.0 / 65025.0));\r\n}\r\n\r\nvec2 packFloat8bitRG(in float val) {\r\n    vec2 pack = vec2(1.0, 255.0) * val;\r\n    pack = fract(pack);\r\n    pack -= vec2(pack.y / 255.0, 0.0);\r\n    return pack;\r\n}\r\n\r\nfloat unpackFloat8bitRG(in vec2 pack) {\r\n    return dot(pack, vec2(1.0, 1.0 / 255.0));\r\n}\r\n\n\r\nconst float PACK_FLUID_VELOCITY_SCALE = 0.0025; \nconst float PACK_FLUID_PRESSURE_SCALE = 0.00025;\r\nconst float PACK_FLUID_DIVERGENCE_SCALE = 0.25;\r\n\r\nconst bool FLOAT_VELOCITY = true;\r\nconst bool FLOAT_PRESSURE = true;\r\nconst bool FLOAT_DIVERGENCE = true;\r\n\r\n\nvec4 packFluidVelocity(in vec2 v){\r\n    if(FLOAT_VELOCITY){\r\n        return vec4(v, 0.0, 0.0);\r\n    }else{\r\n        vec2 nv = (v * PACK_FLUID_VELOCITY_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRG(nv.x), packFloat8bitRG(nv.y));\r\n    }\r\n}\r\n\r\nvec2 unpackFluidVelocity(in vec4 pv){\r\n    if(FLOAT_VELOCITY){\r\n        return pv.xy;\r\n    }else{    \r\n        const float INV_PACK_FLUID_VELOCITY_SCALE = 1./PACK_FLUID_VELOCITY_SCALE;\r\n        vec2 nv = vec2(unpackFloat8bitRG(pv.xy), unpackFloat8bitRG(pv.zw));\r\n        return (2.0*nv.xy - 1.0)* INV_PACK_FLUID_VELOCITY_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidPressure(in float p){\r\n    if(FLOAT_PRESSURE){\r\n        return vec4(p, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float np = (p * PACK_FLUID_PRESSURE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(np), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidPressure(in vec4 pp){\r\n    if(FLOAT_PRESSURE){\r\n        return pp.x;\r\n    }else{    \r\n        const float INV_PACK_FLUID_PRESSURE_SCALE = 1./PACK_FLUID_PRESSURE_SCALE;\r\n        float np = unpackFloat8bitRGB(pp.rgb);\r\n        return (2.0*np - 1.0) * INV_PACK_FLUID_PRESSURE_SCALE;\r\n    }\r\n}\r\n\r\n\nvec4 packFluidDivergence(in float d){\r\n    if(FLOAT_DIVERGENCE){\r\n        return vec4(d, 0.0, 0.0, 0.0);\r\n    }else{\r\n        float nd = (d * PACK_FLUID_DIVERGENCE_SCALE)*0.5 + 0.5;\r\n        return vec4(packFloat8bitRGB(nd), 0.0);\r\n    }\r\n}\r\n\r\nfloat unpackFluidDivergence(in vec4 pd){\r\n    if(FLOAT_DIVERGENCE){\r\n        return pd.x;\r\n    }else{\r\n        const float INV_PACK_FLUID_DIVERGENCE_SCALE = 1./PACK_FLUID_DIVERGENCE_SCALE;\r\n        float nd = unpackFloat8bitRGB(pd.rgb);\r\n        return (2.0*nd - 1.0) * INV_PACK_FLUID_DIVERGENCE_SCALE;\r\n    }\r\n}\n\r\n\nfloat samplePressue(in sampler2D pressure, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n\r\n    #ifdef PRESSURE_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    #endif\r\n\r\n    return unpackFluidPressure(texture2D(pressure, coord + cellOffset * invresolution));\r\n}\r\n\r\n\r\n\nvec2 sampleVelocity(in sampler2D velocity, in vec2 coord){\r\n    vec2 cellOffset = vec2(0.0, 0.0);\r\n    vec2 multiplier = vec2(1.0, 1.0);\r\n\r\n    #ifdef VELOCITY_BOUNDARY\r\n    \n    \n    \n    \n    \n    \n    cellOffset = -floor(coord);\r\n    multiplier -= 2.0*abs(cellOffset);\r\n    #endif\r\n\r\n    vec2 v = unpackFluidVelocity(texture2D(velocity, coord + cellOffset * invresolution));\r\n    return multiplier * v;\r\n}\r\n\r\n#define sampleDivergence(divergence, coord) unpackFluidDivergence(texture2D(divergence, coord))\r\n\r\n\n\tuniform sampler2D texture;\n\tvarying vec2 texelCoord;\n\n\tvoid main(void){\n\t\tfloat d = sampleDivergence(texture, texelCoord);\n\t\tgl_FragColor = vec4(d, -d, 0.0, 1.0);\n\t}\n";
	}
	,__class__: DebugBlitTexture
});
Math.__name__ = true;
let PerformanceMonitor = function(lowerBoundFPS,upperBoundFPS,thresholdTime_ms,fpsSampleSize) {
	if(fpsSampleSize == null) fpsSampleSize = 30;
	if(thresholdTime_ms == null) thresholdTime_ms = 3000;
	if(lowerBoundFPS == null) lowerBoundFPS = 30;
	this.upperBoundEnterTime = null;
	this.lowerBoundEnterTime = null;
	this.fpsTooHighCallback = null;
	this.fpsTooLowCallback = null;
	this.fpsIgnoreBounds = [5,180];
	this.lowerBoundFPS = lowerBoundFPS;
	this.upperBoundFPS = upperBoundFPS;
	this.thresholdTime_ms = thresholdTime_ms;
	this.fpsSample = new RollingSample(fpsSampleSize);
};
$hxClasses["PerformanceMonitor"] = PerformanceMonitor;
PerformanceMonitor.__name__ = true;
PerformanceMonitor.prototype = {
	__class__: PerformanceMonitor
};
let RollingSample = function(length) {
	this.m2 = 0;
	this.pos = 0;
	this.sampleCount = 0;
	this.standardDeviation = 0;
	this.variance = 0;
	this.average = 0;
	let tmp;
	let this1;
	this1 = new Array(length);
	tmp = this1;
	this.samples = tmp;
};
$hxClasses["RollingSample"] = RollingSample;
RollingSample.__name__ = true;
RollingSample.prototype = {
	add: function(v) {
		let delta;
		if(this.sampleCount >= this.samples.length) {
			let bottomValue = this.samples[this.pos];
			delta = bottomValue - this.average;
			this.average -= delta / (this.sampleCount - 1);
			this.m2 -= delta * (bottomValue - this.average);
		} else this.sampleCount++;
		delta = v - this.average;
		this.average += delta / this.sampleCount;
		this.m2 += delta * (v - this.average);
		this.samples[this.pos] = v;
		this.pos++;
		this.pos %= this.samples.length;
		return this.pos;
	}
	,clear: function() {
		let _g1 = 0;
		let _g = this.samples.length;
		while(_g1 < _g) {
			let i = _g1++;
			this.samples[i] = 0;
		}
		this.average = 0;
		this.variance = 0;
		this.standardDeviation = 0;
		this.sampleCount = 0;
		this.m2 = 0;
	}
	,__class__: RollingSample
};
let Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_FluidError) e = e.val;
		return null;
	}
};
Reflect.fields = function(o) {
	let a = [];
	if(o != null) {
		let hasOwnProperty = Object.prototype.hasOwnProperty;
		for( let f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
let SnowApp = function() { };
$hxClasses["FluidApp"] = SnowApp;
SnowApp.__name__ = true;
SnowApp.main = function() {
	SnowApp._flu = new flu();
	SnowApp._host = new Main();
	let _flu_config = { has_loop : true, config_path : "manifest.json", app_package : "fluidity.money"};
	SnowApp._flu.init(_flu_config,SnowApp._host);
};
let Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	let v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
let StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	let c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	let l = s.length;
	let r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	let l = s.length;
	let r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
let Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	let cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	let e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEnum = function(e,constr,params) {
	let f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_FluidError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_FluidError("Constructor " + constr + " need parameters");
		let tmp;
		let func = f;
		tmp = func.apply(e,params);
		return tmp;
	}
	if(params != null && params.length != 0) throw new js__$Boot_FluidError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	let c = e.__constructs__[index];
	if(c == null) throw new js__$Boot_FluidError(index + " is not a valid enum constructor index");
	return Type.createEnum(e,c,params);
};
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
let gltoolbox_GeometryTools = function() { };
$hxClasses["gltoolbox.GeometryTools"] = gltoolbox_GeometryTools;
gltoolbox_GeometryTools.__name__ = true;
gltoolbox_GeometryTools.getCachedUnitQuad = function(drawMode) {
	if(drawMode == null) drawMode = 5;
	let unitQuad = gltoolbox_GeometryTools.unitQuadCache.h[drawMode];
	if(unitQuad == null || !flu_modules_opengl_web_GL.current_context.isBuffer(unitQuad)) {
		unitQuad = gltoolbox_GeometryTools.createQuad(0,0,1,1,drawMode);
		gltoolbox_GeometryTools.unitQuadCache.h[drawMode] = unitQuad;
	}
	return unitQuad;
};
gltoolbox_GeometryTools.createQuad = function(originX,originY,width,height,drawMode,usage) {
	if(usage == null) usage = 35044;
	if(drawMode == null) drawMode = 5;
	if(height == null) height = 1;
	if(width == null) width = 1;
	if(originY == null) originY = 0;
	if(originX == null) originX = 0;
	let quad = flu_modules_opengl_web_GL.current_context.createBuffer();
	let vertices = [];
	switch(drawMode) {
	case 5:case 4:
		vertices = [originX,originY + height,originX,originY,originX + width,originY + height,originX + width,originY];
		if(drawMode == 4) vertices = vertices.concat([originX + width,originY + height,originX,originY]);
		break;
	case 6:
		vertices = [originX,originY + height,originX,originY,originX + width,originY,originX + width,originY + height];
		break;
	}
	flu_modules_opengl_web_GL.current_context.bindBuffer(34962,quad);
	let tmp;
	let this1;
	if(vertices != null) this1 = new Float32Array(vertices); else this1 = null;
	tmp = this1;
	let data = tmp;
	flu_modules_opengl_web_GL.current_context.bufferData(34962,data,usage);
	flu_modules_opengl_web_GL.current_context.bindBuffer(34962,null);
	return quad;
};
let gltoolbox_TextureTools = function() { };
$hxClasses["gltoolbox.TextureTools"] = gltoolbox_TextureTools;
gltoolbox_TextureTools.__name__ = true;
gltoolbox_TextureTools.createTexture = function(width,height,params,data) {
	if(params == null) params = { };
	if(data == null) data = null;
	let _g = 0;
	let _g1 = Reflect.fields(gltoolbox_TextureTools.defaultParams);
	while(_g < _g1.length) {
		let f = _g1[_g];
		++_g;
		if(!Object.prototype.hasOwnProperty.call(params,f)) {
			let value = Reflect.field(gltoolbox_TextureTools.defaultParams,f);
			params[f] = value;
		}
	}
	let texture = flu_modules_opengl_web_GL.current_context.createTexture();
	flu_modules_opengl_web_GL.current_context.bindTexture(3553,texture);
	flu_modules_opengl_web_GL.current_context.texParameteri(3553,10241,params.filter);
	flu_modules_opengl_web_GL.current_context.texParameteri(3553,10240,params.filter);
	flu_modules_opengl_web_GL.current_context.texParameteri(3553,10242,params.wrapS);
	flu_modules_opengl_web_GL.current_context.texParameteri(3553,10243,params.wrapT);
	flu_modules_opengl_web_GL.current_context.pixelStorei(3317,params.unpackAlignment);
	flu_modules_opengl_web_GL.current_context.pixelStorei(37440,params.webGLFlipY?1:0);
	flu_modules_opengl_web_GL.current_context.texImage2D(3553,0,params.channelType,width,height,0,params.channelType,params.dataType,data);
	flu_modules_opengl_web_GL.current_context.bindTexture(3553,null);
	return texture;
};
let gltoolbox_render_ITargetable = function() { };
$hxClasses["gltoolbox.render.ITargetable"] = gltoolbox_render_ITargetable;
gltoolbox_render_ITargetable.__name__ = true;
gltoolbox_render_ITargetable.prototype = {
	__class__: gltoolbox_render_ITargetable
};
let gltoolbox_render_RenderTarget = function(width,height,textureFactory) {
	if(textureFactory == null) textureFactory = function(width1,height1) {
		return gltoolbox_TextureTools.createTexture(width1,height1,null);
	};
	this.width = width;
	this.height = height;
	this.textureFactory = textureFactory;
	this.texture = textureFactory(width,height);
	if(gltoolbox_render_RenderTarget.textureQuad == null) gltoolbox_render_RenderTarget.textureQuad = gltoolbox_GeometryTools.getCachedUnitQuad(5);
	this.frameBufferObject = flu_modules_opengl_web_GL.current_context.createFramebuffer();
	let newTexture = this.textureFactory(width,height);
	flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.frameBufferObject);
	flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,newTexture,0);
	if(this.texture != null) {
		let resampler = gltoolbox_shaders_Resample.instance;
		let _this = resampler.texture;
		_this.dirty = true;
		_this.data = this.texture;
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.frameBufferObject);
		flu_modules_opengl_web_GL.current_context.viewport(0,0,width,height);
		flu_modules_opengl_web_GL.current_context.bindBuffer(34962,gltoolbox_render_RenderTarget.textureQuad);
		if(resampler._active) {
			let _g = 0;
			let _g1 = resampler._uniforms;
			while(_g < _g1.length) {
				let u = _g1[_g];
				++_g;
				u.apply();
			}
			let offset = 0;
			let _g11 = 0;
			let _g2 = resampler._attributes.length;
			while(_g11 < _g2) {
				let i = _g11++;
				let att = resampler._attributes[i];
				let location = att.location;
				if(location != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,resampler._aStride,offset);
				}
				offset += att.byteSize;
			}
		} else {
			if(!resampler._ready) resampler.create();
			flu_modules_opengl_web_GL.current_context.useProgram(resampler._prog);
			let _g3 = 0;
			let _g12 = resampler._uniforms;
			while(_g3 < _g12.length) {
				let u1 = _g12[_g3];
				++_g3;
				u1.apply();
			}
			let offset1 = 0;
			let _g13 = 0;
			let _g4 = resampler._attributes.length;
			while(_g13 < _g4) {
				let i1 = _g13++;
				let att1 = resampler._attributes[i1];
				let location1 = att1.location;
				if(location1 != -1) {
					flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
					flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,resampler._aStride,offset1);
				}
				offset1 += att1.byteSize;
			}
			resampler._active = true;
		}
		flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
		resampler.deactivate();
		flu_modules_opengl_web_GL.current_context.deleteTexture(this.texture);
	} else {
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.frameBufferObject);
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
		flu_modules_opengl_web_GL.current_context.clear(16384);
	}
	this.width = width;
	this.height = height;
	this.texture = newTexture;
	this;
};
$hxClasses["gltoolbox.render.RenderTarget"] = gltoolbox_render_RenderTarget;
gltoolbox_render_RenderTarget.__name__ = true;
gltoolbox_render_RenderTarget.__interfaces__ = [gltoolbox_render_ITargetable];
gltoolbox_render_RenderTarget.prototype = {
	activate: function() {
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.frameBufferObject);
	}
	,__class__: gltoolbox_render_RenderTarget
};
let gltoolbox_render_RenderTarget2Phase = function(width,height,textureFactory) {
	if(textureFactory == null) textureFactory = function(width1,height1) {
		return gltoolbox_TextureTools.createTexture(width1,height1,null);
	};
	this.width = width;
	this.height = height;
	this.textureFactory = textureFactory;
	if(gltoolbox_render_RenderTarget2Phase.textureQuad == null) gltoolbox_render_RenderTarget2Phase.textureQuad = gltoolbox_GeometryTools.getCachedUnitQuad(5);
	this.writeFrameBufferObject = flu_modules_opengl_web_GL.current_context.createFramebuffer();
	this.readFrameBufferObject = flu_modules_opengl_web_GL.current_context.createFramebuffer();
	this.resize(width,height);
};
$hxClasses["gltoolbox.render.RenderTarget2Phase"] = gltoolbox_render_RenderTarget2Phase;
gltoolbox_render_RenderTarget2Phase.__name__ = true;
gltoolbox_render_RenderTarget2Phase.__interfaces__ = [gltoolbox_render_ITargetable];
gltoolbox_render_RenderTarget2Phase.prototype = {
	resize: function(width,height) {
		let newWriteToTexture = this.textureFactory(width,height);
		let newReadFromTexture = this.textureFactory(width,height);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.writeFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,newWriteToTexture,0);
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.readFrameBufferObject);
		flu_modules_opengl_web_GL.current_context.framebufferTexture2D(36160,36064,3553,newReadFromTexture,0);
		if(this.readFromTexture != null) {
			let resampler = gltoolbox_shaders_Resample.instance;
			let _this = resampler.texture;
			_this.dirty = true;
			_this.data = this.readFromTexture;
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.readFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.viewport(0,0,width,height);
			flu_modules_opengl_web_GL.current_context.bindBuffer(34962,gltoolbox_render_RenderTarget2Phase.textureQuad);
			if(resampler._active) {
				let _g = 0;
				let _g1 = resampler._uniforms;
				while(_g < _g1.length) {
					let u = _g1[_g];
					++_g;
					u.apply();
				}
				let offset = 0;
				let _g11 = 0;
				let _g2 = resampler._attributes.length;
				while(_g11 < _g2) {
					let i = _g11++;
					let att = resampler._attributes[i];
					let location = att.location;
					if(location != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location,att.itemCount,att.type,false,resampler._aStride,offset);
					}
					offset += att.byteSize;
				}
			} else {
				if(!resampler._ready) resampler.create();
				flu_modules_opengl_web_GL.current_context.useProgram(resampler._prog);
				let _g3 = 0;
				let _g12 = resampler._uniforms;
				while(_g3 < _g12.length) {
					let u1 = _g12[_g3];
					++_g3;
					u1.apply();
				}
				let offset1 = 0;
				let _g13 = 0;
				let _g4 = resampler._attributes.length;
				while(_g13 < _g4) {
					let i1 = _g13++;
					let att1 = resampler._attributes[i1];
					let location1 = att1.location;
					if(location1 != -1) {
						flu_modules_opengl_web_GL.current_context.enableVertexAttribArray(location1);
						flu_modules_opengl_web_GL.current_context.vertexAttribPointer(location1,att1.itemCount,att1.type,false,resampler._aStride,offset1);
					}
					offset1 += att1.byteSize;
				}
				resampler._active = true;
			}
			flu_modules_opengl_web_GL.current_context.drawArrays(5,0,4);
			resampler.deactivate();
			flu_modules_opengl_web_GL.current_context.deleteTexture(this.readFromTexture);
		} else {
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.readFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
			flu_modules_opengl_web_GL.current_context.clear(16384);
		}
		if(this.writeToTexture != null) flu_modules_opengl_web_GL.current_context.deleteTexture(this.writeToTexture); else {
			flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.writeFrameBufferObject);
			flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1);
			flu_modules_opengl_web_GL.current_context.clear(16384);
		}
		this.width = width;
		this.height = height;
		this.writeToTexture = newWriteToTexture;
		this.readFromTexture = newReadFromTexture;
		return this;
	}
	,activate: function() {
		flu_modules_opengl_web_GL.current_context.bindFramebuffer(36160,this.writeFrameBufferObject);
	}
	,__class__: gltoolbox_render_RenderTarget2Phase
};
let js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		let cl = o.__class__;
		if(cl != null) return cl;
		let name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	let t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				let str2 = o[0] + "(";
				s += "\t";
				let _g1 = 2;
				let _g = o.length;
				while(_g1 < _g) {
					let i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			let l = o.length;
			let i;
			let str1 = "[";
			s += "\t";
			let _g2 = 0;
			while(_g2 < l) {
				let i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		let tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_FluidError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			let s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		let k = null;
		let str = "{\n";
		s += "\t";
		let hasp = o.hasOwnProperty != null;
		for( let k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	let intf = cc.__interfaces__;
	if(intf != null) {
		let _g1 = 0;
		let _g = intf.length;
		while(_g1 < _g) {
			let i = _g1++;
			let i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_FluidError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	let name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
let gltoolbox_shaders_Resample = function() {
	shaderblox_ShaderBase.call(this);
};
$hxClasses["gltoolbox.shaders.Resample"] = gltoolbox_shaders_Resample;
gltoolbox_shaders_Resample.__name__ = true;
gltoolbox_shaders_Resample.__super__ = shaderblox_ShaderBase;
gltoolbox_shaders_Resample.prototype = $extend(shaderblox_ShaderBase.prototype,{
	createProperties: function() {
		shaderblox_ShaderBase.prototype.createProperties.call(this);
		let instance = new shaderblox_uniforms_UTexture("texture",null,false);
		this.texture = instance;
		this._uniforms.push(instance);
		let instance1 = new shaderblox_attributes_FloatAttribute("vertexPosition",0,2);
		this.vertexPosition = instance1;
		this._attributes.push(instance1);
		this._aStride += 8;
	}
	,initSources: function() {
		this._vertSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nattribute vec2 vertexPosition;\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\ttexelCoord = vertexPosition;\n\t\tgl_Position = vec4(vertexPosition*2.0 - 1.0, 0.0, 1.0 );\n\t}\n";
		this._fragSource = "\r\n#ifdef GL_ES\r\nprecision highp float;\r\nprecision highp sampler2D;\r\n#endif\n\nuniform sampler2D texture;\n\n\tvarying vec2 texelCoord;\n\n\tvoid main(){\n\t\tgl_FragColor = texture2D(texture, texelCoord);\n\t}\n";
	}
	,__class__: gltoolbox_shaders_Resample
});
let flu_IMap = function() { };
$hxClasses["fluid.IMap"] = flu_IMap;
flu_IMap.__name__ = true;
flu_IMap.prototype = {
	__class__: flu_IMap
};
let flu__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["fluid._Int64.___Int64"] = flu__$Int64__$_$_$Int64;
flu__$Int64__$_$_$Int64.__name__ = true;
flu__$Int64__$_$_$Int64.prototype = {
	__class__: flu__$Int64__$_$_$Int64
};
let flu_Timer = function(time_ms) {
	let me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["fluid.Timer"] = flu_Timer;
flu_Timer.__name__ = true;
flu_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
flu_Timer.prototype = {
	run: function() {
	}
	,__class__: flu_Timer
};
let flu_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["fluid.ds.IntMap"] = flu_ds_IntMap;
flu_ds_IntMap.__name__ = true;
flu_ds_IntMap.__interfaces__ = [flu_IMap];
flu_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		let a = [];
		for( let key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: flu_ds_IntMap
};
let flu_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["fluid.ds.ObjectMap"] = flu_ds_ObjectMap;
flu_ds_ObjectMap.__name__ = true;
flu_ds_ObjectMap.__interfaces__ = [flu_IMap];
flu_ds_ObjectMap.prototype = {
	set: function(key,value) {
		let id = key.__id__ || (key.__id__ = ++flu_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,remove: function(key) {
		let id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		let a = [];
		for( let key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: flu_ds_ObjectMap
};
let flu_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["fluid.ds._StringMap.StringMapIterator"] = flu_ds__$StringMap_StringMapIterator;
flu_ds__$StringMap_StringMapIterator.__name__ = true;
flu_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		let tmp;
		let _this = this.map;
		let key = this.keys[this.index++];
		if(__map_reserved[key] != null) tmp = _this.getReserved(key); else tmp = _this.h[key];
		return tmp;
	}
	,__class__: flu_ds__$StringMap_StringMapIterator
};
let flu_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["fluid.ds.StringMap"] = flu_ds_StringMap;
flu_ds_StringMap.__name__ = true;
flu_ds_StringMap.__interfaces__ = [flu_IMap];
flu_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		return this.rh == null?null:this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,arrayKeys: function() {
		let out = [];
		for( let key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( let key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: flu_ds_StringMap
};
let flu_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["fluid.io.Bytes"] = flu_io_Bytes;
flu_io_Bytes.__name__ = true;
flu_io_Bytes.prototype = {
	getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_FluidError(flu_io_Error.OutsideBounds);
		let s = "";
		let b = this.b;
		let fcc = String.fromCharCode;
		let i = pos;
		let max = pos + len;
		while(i < max) {
			let c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				let c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				let c21 = b[i++];
				let c3 = b[i++];
				let u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: flu_io_Bytes
};
let flu_io_Error = $hxClasses["fluid.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
flu_io_Error.Blocked = ["Blocked",0];
flu_io_Error.Blocked.toString = $estr;
flu_io_Error.Blocked.__enum__ = flu_io_Error;
flu_io_Error.Overflow = ["Overflow",1];
flu_io_Error.Overflow.toString = $estr;
flu_io_Error.Overflow.__enum__ = flu_io_Error;
flu_io_Error.OutsideBounds = ["OutsideBounds",2];
flu_io_Error.OutsideBounds.toString = $estr;
flu_io_Error.OutsideBounds.__enum__ = flu_io_Error;
flu_io_Error.Custom = function(e) { let $x = ["Custom",3,e]; $x.__enum__ = flu_io_Error; $x.toString = $estr; return $x; };
flu_io_Error.__empty_constructs__ = [flu_io_Error.Blocked,flu_io_Error.Overflow,flu_io_Error.OutsideBounds];
let flu_io_FPHelper = function() { };
$hxClasses["fluid.io.FPHelper"] = flu_io_FPHelper;
flu_io_FPHelper.__name__ = true;
flu_io_FPHelper.i32ToFloat = function(i) {
	let sign = 1 - (i >>> 31 << 1);
	let exp = i >>> 23 & 255;
	let sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
flu_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	let af = f < 0?-f:f;
	let exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	let sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
flu_io_FPHelper.i64ToDouble = function(low,high) {
	let sign = 1 - (high >>> 31 << 1);
	let exp = (high >> 20 & 2047) - 1023;
	let sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
flu_io_FPHelper.doubleToI64 = function(v) {
	let i64 = flu_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		let av = v < 0?-v:v;
		let exp = Math.floor(Math.log(av) / 0.6931471805599453);
		let tmp;
		let v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		tmp = Math.round(v1);
		let sig = tmp;
		let sig_l = sig | 0;
		let sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
let flu_io_Path = function() { };
$hxClasses["fluid.io.Path"] = flu_io_Path;
flu_io_Path.__name__ = true;
flu_io_Path.join = function(paths) {
	let paths1 = paths.filter(function(s) {
		return s != null && s != "";
	});
	if(paths1.length == 0) return "";
	let path = paths1[0];
	let _g1 = 1;
	let _g = paths1.length;
	while(_g1 < _g) {
		let i = _g1++;
		path = flu_io_Path.addTrailingSlash(path);
		path += paths1[i];
	}
	return flu_io_Path.normalize(path);
};
flu_io_Path.normalize = function(path) {
	path = path.split("\\").join("/");
	if(path == null || path == "/") return "/";
	let target = [];
	let _g = 0;
	let _g1 = path.split("/");
	while(_g < _g1.length) {
		let token = _g1[_g];
		++_g;
		if(token == ".." && target.length > 0 && target[target.length - 1] != "..") target.pop(); else if(token != ".") target.push(token);
	}
	let tmp = target.join("/");
	let regex = new EReg("([^:])/+","g");
	regex.replace(tmp,"$1" + "/");
	let acc_b = "";
	let colon = false;
	let slashes = false;
	let _g11 = 0;
	let _g2 = tmp.length;
	while(_g11 < _g2) {
		let i = _g11++;
		let _g21 = HxOverrides.cca(tmp,i);
		if(_g21 != null) switch(_g21) {
		case 58:
			acc_b += ":";
			colon = true;
			break;
		case 47:
			if(colon == false) slashes = true; else {
				colon = false;
				if(slashes) {
					acc_b += "/";
					slashes = false;
				}
				let x = String.fromCharCode(_g21);
				acc_b += x == null?"null":"" + x;
			}
			break;
		default:
			colon = false;
			if(slashes) {
				acc_b += "/";
				slashes = false;
			}
			let x1 = String.fromCharCode(_g21);
			acc_b += x1 == null?"null":"" + x1;
		} else {
			colon = false;
			if(slashes) {
				acc_b += "/";
				slashes = false;
			}
			let x1 = String.fromCharCode(_g21);
			acc_b += x1 == null?"null":"" + x1;
		}
	}
	let result = acc_b;
	return result;
};
flu_io_Path.addTrailingSlash = function(path) {
	if(path.length == 0) return "/";
	let c1 = path.lastIndexOf("/");
	let c2 = path.lastIndexOf("\\");
	return c1 < c2?c2 != path.length - 1?path + "\\":path:c1 != path.length - 1?path + "/":path;
};
let hxColorToolkit_spaces_Color = function() { };
$hxClasses["hxColorToolkit.spaces.Color"] = hxColorToolkit_spaces_Color;
hxColorToolkit_spaces_Color.__name__ = true;
let hxColorToolkit_spaces_RGB = function(r,g,b) {
	if(b == null) b = 0;
	if(g == null) g = 0;
	if(r == null) r = 0;
	this.numOfChannels = 3;
	this.data = [];
	this.set_red(r);
	this.set_green(g);
	this.set_blue(b);
};
$hxClasses["hxColorToolkit.spaces.RGB"] = hxColorToolkit_spaces_RGB;
hxColorToolkit_spaces_RGB.__name__ = true;
hxColorToolkit_spaces_RGB.__interfaces__ = [hxColorToolkit_spaces_Color];
hxColorToolkit_spaces_RGB.prototype = {
	getValue: function(channel) {
		return this.data[channel];
	}
	,setValue: function(channel,val) {
		this.data[channel] = Math.min(255,Math.max(val,0));
		return val;
	}
	,get_red: function() {
		return this.getValue(0);
	}
	,set_red: function(value) {
		return this.setValue(0,value);
	}
	,get_green: function() {
		return this.getValue(1);
	}
	,set_green: function(value) {
		return this.setValue(1,value);
	}
	,get_blue: function() {
		return this.getValue(2);
	}
	,set_blue: function(value) {
		return this.setValue(2,value);
	}
	,__class__: hxColorToolkit_spaces_RGB
};
let hxColorToolkit_spaces_HSB = function(hue,saturation,brightness) {
	if(brightness == null) brightness = 0;
	if(saturation == null) saturation = 0;
	if(hue == null) hue = 0;
	this.numOfChannels = 3;
	this.data = [];
	this.set_hue(hue);
	this.set_saturation(saturation);
	this.set_brightness(brightness);
};
$hxClasses["hxColorToolkit.spaces.HSB"] = hxColorToolkit_spaces_HSB;
hxColorToolkit_spaces_HSB.__name__ = true;
hxColorToolkit_spaces_HSB.__interfaces__ = [hxColorToolkit_spaces_Color];
hxColorToolkit_spaces_HSB.loop = function(index,length) {
	if(index < 0) index = length + index % length;
	if(index >= length) index %= length;
	return index;
};
hxColorToolkit_spaces_HSB.prototype = {
	getValue: function(channel) {
		return this.data[channel];
	}
	,get_hue: function() {
		return this.getValue(0);
	}
	,set_hue: function(val) {
		this.data[0] = hxColorToolkit_spaces_HSB.loop(val,360);
		return val;
	}
	,get_saturation: function() {
		return this.getValue(1);
	}
	,set_saturation: function(val) {
		this.data[1] = Math.min(100,Math.max(val,0));
		return val;
	}
	,get_brightness: function() {
		return this.getValue(2);
	}
	,set_brightness: function(val) {
		this.data[2] = Math.min(100,Math.max(val,0));
		return val;
	}
	,toRGB: function() {
		let hue = this.get_hue();
		let saturation = this.get_saturation();
		let brightness = this.get_brightness();
		let r = 0;
		let g = 0;
		let b = 0;
		let i;
		let f;
		let p;
		let q;
		let t;
		hue %= 360;
		if(brightness == 0) return new hxColorToolkit_spaces_RGB();
		saturation *= 0.01;
		brightness *= 0.01;
		hue /= 60;
		i = Math.floor(hue);
		f = hue - i;
		p = brightness * (1 - saturation);
		q = brightness * (1 - saturation * f);
		t = brightness * (1 - saturation * (1 - f));
		if(i == 0) {
			r = brightness;
			g = t;
			b = p;
		} else if(i == 1) {
			r = q;
			g = brightness;
			b = p;
		} else if(i == 2) {
			r = p;
			g = brightness;
			b = t;
		} else if(i == 3) {
			r = p;
			g = q;
			b = brightness;
		} else if(i == 4) {
			r = t;
			g = p;
			b = brightness;
		} else if(i == 5) {
			r = brightness;
			g = p;
			b = q;
		}
		return new hxColorToolkit_spaces_RGB(r * 255,g * 255,b * 255);
	}
	,__class__: hxColorToolkit_spaces_HSB
};
let js__$Boot_FluidError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_FluidError);
};
$hxClasses["js._Boot.FluidError"] = js__$Boot_FluidError;
js__$Boot_FluidError.__name__ = true;
js__$Boot_FluidError.__super__ = Error;
js__$Boot_FluidError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_FluidError
});
let js_Web = function() { };
$hxClasses["js.Web"] = js_Web;
js_Web.__name__ = true;
js_Web.getParams = function() {
	let result = new flu_ds_StringMap();
	let paramObj = eval("\r\n\t\t\t(function() {\r\n\t\t\t    let match,\r\n\t\t\t        pl     = /\\+/g,  // Regex for replacing addition symbol with a space\r\n\t\t\t        search = /([^&=]+)=?([^&]*)/g,\r\n\t\t\t        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },\r\n\t\t\t        query  = window.location.search.substring(1);\r\n\r\n\t\t\t    let urlParams = {};\r\n\t\t\t    while (match = search.exec(query))\r\n\t\t\t       urlParams[decode(match[1])] = decode(match[2]);\r\n\t\t\t    return urlParams;\r\n\t\t\t})();\r\n\t\t");
	let _g = 0;
	let _g1 = Reflect.fields(paramObj);
	while(_g < _g1.length) {
		let f = _g1[_g];
		++_g;
		let value = Reflect.field(paramObj,f);
		if(__map_reserved[f] != null) result.setReserved(f,value); else result.h[f] = value;
	}
	return result;
};
let js_html__$CanvasElement_CanvasUtil = function() { };
$hxClasses["js.html._CanvasElement.CanvasUtil"] = js_html__$CanvasElement_CanvasUtil;
js_html__$CanvasElement_CanvasUtil.__name__ = true;
js_html__$CanvasElement_CanvasUtil.getContextWebGL = function(canvas,attribs) {
	let _g = 0;
	let _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		let name = _g1[_g];
		++_g;
		let ctx = canvas.getContext(name, { powerPreference: "high-performance" }) || canvas.getContext('experimental-webgl', { powerPreference: "high-performance" });
		if(ctx != null) return ctx;
	}
	return null;
};
let js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		let len = a;
		this.a = [];
		let _g = 0;
		while(_g < len) {
			let i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	let u = new Uint8Array(this,begin,end == null?null:end - begin);
	let result = new ArrayBuffer(u.byteLength);
	let resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
let js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	this.offset = byteOffset == null?0:byteOffset;
	this.length = byteLength == null?buffer.byteLength - this.offset:byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_FluidError(flu_io_Error.OutsideBounds);
};
$hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		let v = this.buf.a[this.offset + byteOffset];
		return v >= 128?v - 256:v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		let v = this.getUint16(byteOffset,littleEndian);
		return v >= 32768?v - 65536:v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		return littleEndian?this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8:this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		let p = this.offset + byteOffset;
		let a = this.buf.a[p++];
		let b = this.buf.a[p++];
		let c = this.buf.a[p++];
		let d = this.buf.a[p++];
		return littleEndian?a | b << 8 | c << 16 | d << 24:d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		let v = this.getInt32(byteOffset,littleEndian);
		return v < 0?v + 4294967296.:v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return flu_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		let a = this.getInt32(byteOffset,littleEndian);
		let b = this.getInt32(byteOffset + 4,littleEndian);
		return flu_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value < 0?value + 128 & 255:value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		let p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		let p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,flu_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		let i64 = flu_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
let js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	let arr;
	if(typeof(arg1) == "number") {
		arr = [];
		let _g = 0;
		while(_g < arg1) {
			let i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		let buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_FluidError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	let t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		let a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_FluidError("set() outside of range");
		let _g1 = 0;
		let _g = arg.byteLength;
		while(_g1 < _g) {
			let i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		let a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_FluidError("set() outside of range");
		let _g11 = 0;
		let _g2 = a1.length;
		while(_g11 < _g2) {
			let i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_FluidError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	let t = this;
	let a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
let shaderblox_attributes_Attribute = function() { };
$hxClasses["shaderblox.attributes.Attribute"] = shaderblox_attributes_Attribute;
shaderblox_attributes_Attribute.__name__ = true;
shaderblox_attributes_Attribute.prototype = {
	__class__: shaderblox_attributes_Attribute
};
let shaderblox_attributes_FloatAttribute = function(name,location,nFloats) {
	if(nFloats == null) nFloats = 1;
	this.name = name;
	this.location = location;
	this.byteSize = nFloats * 4;
	this.itemCount = nFloats;
	this.type = 5126;
};
$hxClasses["shaderblox.attributes.FloatAttribute"] = shaderblox_attributes_FloatAttribute;
shaderblox_attributes_FloatAttribute.__name__ = true;
shaderblox_attributes_FloatAttribute.__super__ = shaderblox_attributes_Attribute;
shaderblox_attributes_FloatAttribute.prototype = $extend(shaderblox_attributes_Attribute.prototype,{
	__class__: shaderblox_attributes_FloatAttribute
});
let shaderblox_glsl_GLSLTools = function() { };
$hxClasses["shaderblox.glsl.GLSLTools"] = shaderblox_glsl_GLSLTools;
shaderblox_glsl_GLSLTools.__name__ = true;
shaderblox_glsl_GLSLTools.injectConstValue = function(src,name,value) {
	let storageQualifier = "const";
	let tmp;
	let _this = shaderblox_glsl_GLSLTools.STORAGE_QUALIFIER_TYPES;
	if(__map_reserved[storageQualifier] != null) tmp = _this.getReserved(storageQualifier); else tmp = _this.h[storageQualifier];
	let types = tmp;
	let reg = new EReg(storageQualifier + "\\s+((" + shaderblox_glsl_GLSLTools.PRECISION_QUALIFIERS.join("|") + ")\\s+)?(" + types.join("|") + ")\\s+([^;]+)","m");
	let src1 = shaderblox_glsl_GLSLTools.stripComments(src);
	let currStr = src1;
	while(reg.match(currStr)) {
		let declarationPos = reg.matchedPos();
		let rawDeclarationString = reg.matched(0);
		let exploded = shaderblox_glsl_GLSLTools.bracketExplode(rawDeclarationString,"()");
		let rootScopeStr = Lambda.fold(exploded.contents,function(n,rs) {
			return rs + (js_Boot.__instanceof(n,shaderblox_glsl__$GLSLTools_StringNode)?n.toString():"");
		},"");
		let rConstName = new EReg("\\b(" + name + ")\\b\\s*=","m");
		let nameFound = rConstName.match(rootScopeStr);
		if(nameFound) {
			let namePos = rConstName.matchedPos();
			let initializerLength = 0;
			if((initializerLength = rConstName.matchedRight().indexOf(",")) == -1) initializerLength = rConstName.matchedRight().length;
			let initializerRangeInRootStr_start = namePos.pos + namePos.len;
			let initializerRangeInRootStr_end = namePos.pos + namePos.len + initializerLength;
			let absoluteOffset = src1.length - currStr.length + declarationPos.pos;
			let initializerRangeAbsolute_start = shaderblox_glsl_GLSLTools.compressedToExploded(exploded,initializerRangeInRootStr_start) + absoluteOffset;
			let initializerRangeAbsolute_end = shaderblox_glsl_GLSLTools.compressedToExploded(exploded,initializerRangeInRootStr_end) + absoluteOffset;
			let srcBefore = src1.substring(0,initializerRangeAbsolute_start);
			let srcAfter = src1.substring(initializerRangeAbsolute_end);
			return srcBefore + value + srcAfter;
		}
		currStr = reg.matchedRight();
	}
	return null;
};
shaderblox_glsl_GLSLTools.compressedToExploded = function(scope,compressedPosition) {
	let stringTotal = 0;
	let nodeTotal = 0;
	let targetIndex = null;
	let _g1 = 0;
	let _g = scope.contents.length;
	while(_g1 < _g) {
		let i = _g1++;
		let n = scope.contents[i];
		let len = n.toString().length;
		if(js_Boot.__instanceof(n,shaderblox_glsl__$GLSLTools_StringNode)) {
			if(stringTotal + len > compressedPosition) {
				targetIndex = i;
				break;
			}
			stringTotal += len;
		}
		nodeTotal += len;
	}
	return compressedPosition - stringTotal + nodeTotal;
};
shaderblox_glsl_GLSLTools.stripComments = function(src) {
	return new EReg("(/\\*([\\s\\S]*?)\\*/)|(//(.*)$)","igm").replace(src,"");
};
shaderblox_glsl_GLSLTools.bracketExplode = function(src,brackets) {
	if(brackets.length != 2) return null;
	let open = brackets.charAt(0);
	let close = brackets.charAt(1);
	let root = new shaderblox_glsl__$GLSLTools_ScopeNode();
	let scopeStack = [];
	let currentScope = root;
	let currentNode = null;
	let c;
	let level = 0;
	let _g1 = 0;
	let _g = src.length;
	while(_g1 < _g) {
		let i = _g1++;
		c = src.charAt(i);
		if(c == open) {
			level++;
			let newScope = new shaderblox_glsl__$GLSLTools_ScopeNode(brackets);
			currentScope.contents.push(newScope);
			scopeStack.push(currentScope);
			currentScope = newScope;
			currentNode = currentScope;
		} else if(c == close) {
			level--;
			currentScope = scopeStack.pop();
			currentNode = currentScope;
		} else {
			if(!js_Boot.__instanceof(currentNode,shaderblox_glsl__$GLSLTools_StringNode)) {
				currentNode = new shaderblox_glsl__$GLSLTools_StringNode();
				currentScope.contents.push(currentNode);
			}
			(js_Boot.__cast(currentNode , shaderblox_glsl__$GLSLTools_StringNode)).contents += c;
		}
	}
	return root;
};
let shaderblox_glsl__$GLSLTools_INode = function() { };
$hxClasses["shaderblox.glsl._GLSLTools.INode"] = shaderblox_glsl__$GLSLTools_INode;
shaderblox_glsl__$GLSLTools_INode.__name__ = true;
shaderblox_glsl__$GLSLTools_INode.prototype = {
	__class__: shaderblox_glsl__$GLSLTools_INode
};
let shaderblox_glsl__$GLSLTools_StringNode = function(str) {
	if(str == null) str = "";
	this.contents = str;
};
$hxClasses["shaderblox.glsl._GLSLTools.StringNode"] = shaderblox_glsl__$GLSLTools_StringNode;
shaderblox_glsl__$GLSLTools_StringNode.__name__ = true;
shaderblox_glsl__$GLSLTools_StringNode.__interfaces__ = [shaderblox_glsl__$GLSLTools_INode];
shaderblox_glsl__$GLSLTools_StringNode.prototype = {
	toString: function() {
		return this.contents;
	}
	,__class__: shaderblox_glsl__$GLSLTools_StringNode
};
let shaderblox_glsl__$GLSLTools_ScopeNode = function(brackets) {
	this.closeBracket = "";
	this.openBracket = "";
	this.contents = [];
	if(brackets != null) {
		this.openBracket = brackets.charAt(0);
		this.closeBracket = brackets.charAt(1);
	}
};
$hxClasses["shaderblox.glsl._GLSLTools.ScopeNode"] = shaderblox_glsl__$GLSLTools_ScopeNode;
shaderblox_glsl__$GLSLTools_ScopeNode.__name__ = true;
shaderblox_glsl__$GLSLTools_ScopeNode.__interfaces__ = [shaderblox_glsl__$GLSLTools_INode];
shaderblox_glsl__$GLSLTools_ScopeNode.prototype = {
	toString: function() {
		let str = this.openBracket;
		let _g = 0;
		let _g1 = this.contents;
		while(_g < _g1.length) {
			let n = _g1[_g];
			++_g;
			str += n.toString();
		}
		return str + this.closeBracket;
	}
	,__class__: shaderblox_glsl__$GLSLTools_ScopeNode
};
let shaderblox_uniforms_IAppliable = function() { };
$hxClasses["shaderblox.uniforms.IAppliable"] = shaderblox_uniforms_IAppliable;
shaderblox_uniforms_IAppliable.__name__ = true;
shaderblox_uniforms_IAppliable.prototype = {
	__class__: shaderblox_uniforms_IAppliable
};
let shaderblox_uniforms_UniformBase_$Bool = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_Bool"] = shaderblox_uniforms_UniformBase_$Bool;
shaderblox_uniforms_UniformBase_$Bool.__name__ = true;
shaderblox_uniforms_UniformBase_$Bool.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$Bool
};
let shaderblox_uniforms_UBool = function(name,index,f) {
	if(f == null) f = false;
	shaderblox_uniforms_UniformBase_$Bool.call(this,name,index,f);
};
$hxClasses["shaderblox.uniforms.UBool"] = shaderblox_uniforms_UBool;
shaderblox_uniforms_UBool.__name__ = true;
shaderblox_uniforms_UBool.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UBool.__super__ = shaderblox_uniforms_UniformBase_$Bool;
shaderblox_uniforms_UBool.prototype = $extend(shaderblox_uniforms_UniformBase_$Bool.prototype,{
	apply: function() {
		flu_modules_opengl_web_GL.current_context.uniform1i(this.location,this.data?1:0);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UBool
});
let shaderblox_uniforms_UniformBase_$Float = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_Float"] = shaderblox_uniforms_UniformBase_$Float;
shaderblox_uniforms_UniformBase_$Float.__name__ = true;
shaderblox_uniforms_UniformBase_$Float.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$Float
};
let shaderblox_uniforms_UFloat = function(name,index,f) {
	if(f == null) f = 0.0;
	shaderblox_uniforms_UniformBase_$Float.call(this,name,index,f);
};
$hxClasses["shaderblox.uniforms.UFloat"] = shaderblox_uniforms_UFloat;
shaderblox_uniforms_UFloat.__name__ = true;
shaderblox_uniforms_UFloat.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UFloat.__super__ = shaderblox_uniforms_UniformBase_$Float;
shaderblox_uniforms_UFloat.prototype = $extend(shaderblox_uniforms_UniformBase_$Float.prototype,{
	apply: function() {
		flu_modules_opengl_web_GL.current_context.uniform1f(this.location,this.data);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UFloat
});
let shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_js_html_webgl_Texture"] = shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture;
shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture.__name__ = true;
shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture
};
let shaderblox_uniforms_UTexture = function(name,index,cube) {
	if(cube == null) cube = false;
	this.cube = cube;
	this.type = cube?34067:3553;
	shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture.call(this,name,index,null);
};
$hxClasses["shaderblox.uniforms.UTexture"] = shaderblox_uniforms_UTexture;
shaderblox_uniforms_UTexture.__name__ = true;
shaderblox_uniforms_UTexture.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UTexture.__super__ = shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture;
shaderblox_uniforms_UTexture.prototype = $extend(shaderblox_uniforms_UniformBase_$js_$html_$webgl_$Texture.prototype,{
	apply: function() {
		if(this.data == null) return;
		let idx = 33984 + this.samplerIndex;
		if(shaderblox_uniforms_UTexture.lastActiveTexture != idx) {
			let texture = shaderblox_uniforms_UTexture.lastActiveTexture = idx;
			flu_modules_opengl_web_GL.current_context.activeTexture(texture);
		}
		flu_modules_opengl_web_GL.current_context.uniform1i(this.location,this.samplerIndex);
		flu_modules_opengl_web_GL.current_context.bindTexture(this.type,this.data);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UTexture
});
let shaderblox_uniforms_Vector2 = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["shaderblox.uniforms.Vector2"] = shaderblox_uniforms_Vector2;
shaderblox_uniforms_Vector2.__name__ = true;
shaderblox_uniforms_Vector2.prototype = {
	__class__: shaderblox_uniforms_Vector2
};
let shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2 = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_shaderblox_uniforms_Vector2"] = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2.__name__ = true;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2
};
let shaderblox_uniforms_UVec2 = function(name,index,x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2.call(this,name,index,new shaderblox_uniforms_Vector2(x,y));
};
$hxClasses["shaderblox.uniforms.UVec2"] = shaderblox_uniforms_UVec2;
shaderblox_uniforms_UVec2.__name__ = true;
shaderblox_uniforms_UVec2.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UVec2.__super__ = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2;
shaderblox_uniforms_UVec2.prototype = $extend(shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector2.prototype,{
	apply: function() {
		flu_modules_opengl_web_GL.current_context.uniform2f(this.location,this.data.x,this.data.y);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UVec2
});
let shaderblox_uniforms_Vector3 = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};
$hxClasses["shaderblox.uniforms.Vector3"] = shaderblox_uniforms_Vector3;
shaderblox_uniforms_Vector3.__name__ = true;
shaderblox_uniforms_Vector3.prototype = {
	__class__: shaderblox_uniforms_Vector3
};
let shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3 = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_shaderblox_uniforms_Vector3"] = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3.__name__ = true;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3
};
let shaderblox_uniforms_UVec3 = function(name,index,x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3.call(this,name,index,new shaderblox_uniforms_Vector3(x,y,z));
};
$hxClasses["shaderblox.uniforms.UVec3"] = shaderblox_uniforms_UVec3;
shaderblox_uniforms_UVec3.__name__ = true;
shaderblox_uniforms_UVec3.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UVec3.__super__ = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3;
shaderblox_uniforms_UVec3.prototype = $extend(shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector3.prototype,{
	apply: function() {
		flu_modules_opengl_web_GL.current_context.uniform3f(this.location,this.data.x,this.data.y,this.data.z);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UVec3
});
let shaderblox_uniforms_Vector4 = function(x,y,z,w) {
	if(w == null) w = 0;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
$hxClasses["shaderblox.uniforms.Vector4"] = shaderblox_uniforms_Vector4;
shaderblox_uniforms_Vector4.__name__ = true;
shaderblox_uniforms_Vector4.prototype = {
	__class__: shaderblox_uniforms_Vector4
};
let shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4 = function(name,index,data) {
	this.name = name;
	this.location = index;
	this.dirty = true;
	this.data = data;
};
$hxClasses["shaderblox.uniforms.UniformBase_shaderblox_uniforms_Vector4"] = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4.__name__ = true;
shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4.prototype = {
	__class__: shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4
};
let shaderblox_uniforms_UVec4 = function(name,index,x,y,z,w) {
	if(w == null) w = 0;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4.call(this,name,index,new shaderblox_uniforms_Vector4(x,y,z,w));
};
$hxClasses["shaderblox.uniforms.UVec4"] = shaderblox_uniforms_UVec4;
shaderblox_uniforms_UVec4.__name__ = true;
shaderblox_uniforms_UVec4.__interfaces__ = [shaderblox_uniforms_IAppliable];
shaderblox_uniforms_UVec4.__super__ = shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4;
shaderblox_uniforms_UVec4.prototype = $extend(shaderblox_uniforms_UniformBase_$shaderblox_$uniforms_$Vector4.prototype,{
	apply: function() {
		flu_modules_opengl_web_GL.current_context.uniform4f(this.location,this.data.x,this.data.y,this.data.z,this.data.w);
		this.dirty = false;
	}
	,__class__: shaderblox_uniforms_UVec4
});
let flu = function() {
	this.is_ready = false;
	this.was_ready = false;
	this.has_shutdown = false;
	this.shutting_down = false;
	this.os = "unknown";
	this.platform = "unknown";
	this.freeze = false;
	this.platform = "web";
	flu.core = new flu_core_web_Core(this);
	flu.next_queue = [];
	flu.defer_queue = [];
};
$hxClasses["fluidState.fluidState"] = flu;
flu.__name__ = true;
flu.prototype = {
	shutdown: function() {
		this.shutting_down = true;
		this.host.ondestroy();
		this.io.module.destroy();
		this.input.destroy();
		this.windowing.destroy();
		flu.core.shutdown();
		this.has_shutdown = true;
	}
	,render: function() {
		this.windowing.update();
	}
	,dispatch_system_event: function(_event) {
		this.on_event(_event);
	}
	,init: function(_flu_config,_host) {
		this.flu_config = _flu_config;
		if(this.flu_config.app_package == null) this.flu_config.app_package = "org.flukit.fluidState";
		if(this.flu_config.config_path == null) this.flu_config.config_path = "";
		this.config = this.default_config();
		this.host = _host;
		this.host.app = this;
		flu.core.init($bind(this,this.on_event));
	}
	,on_flu_init: function() {
		this.host.on_internal_init();
	}
	,on_flu_ready: function() {
		let _g = this;
		if(this.was_ready) throw new js__$Boot_FluidError(flu_types_Error.error("firing ready event more than once is invalid usage"));
		this.io = new flu_system_io_IO(this);
		this.input = new flu_system_input_Input(this);
		this.assets = new flu_system_assets_Assets(this);
		this.windowing = new flu_system_window_Windowing(this);
		this.was_ready = true;
		this.setup_app_path();
		this.setup_configs().then(function(_) {
			_g.setup_default_window();
			let func = $bind(_g,_g.on_ready);
			if(func != null) flu.next_queue.push(func);
		}).error(function(e) {
			throw new js__$Boot_FluidError(flu_types_Error.init("fluidState / cannot recover from error: " + e));
		});
		flu_api_Promises.step();
		while(flu.next_queue.length > 0) {
			let count = flu.next_queue.length;
			let i = 0;
			while(i < count) {
				(flu.next_queue.shift())();
				++i;
			}
		}
		while(flu.defer_queue.length > 0) {
			let count1 = flu.defer_queue.length;
			let i1 = 0;
			while(i1 < count1) {
				(flu.defer_queue.shift())();
				++i1;
			}
		}
	}
	,do_internal_update: function(dt) {
		this.io.module.update();
		this.input.update();
		this.host.update(dt);
	}
	,on_ready: function() {
		this.is_ready = true;
		this.host.ready();
	}
	,on_flu_update: function() {
		if(this.freeze) return;
		flu_api_Timer.update();
		flu_api_Promises.step();
		let count = flu.next_queue.length;
		let i = 0;
		while(i < count) {
			(flu.next_queue.shift())();
			++i;
		}
		if(!this.is_ready) return;
		this.host.ontickstart();
		this.host.on_internal_update();
		this.host.on_internal_render();
		this.host.ontickend();
		let count1 = flu.defer_queue.length;
		let i1 = 0;
		while(i1 < count1) {
			(flu.defer_queue.shift())();
			++i1;
		}
	}
	,on_event: function(_event) {
		_event.type != 3 && _event.type != 0 && _event.type != 5 && _event.type != 6;
		if(this.is_ready) {
			this.io.module.on_event(_event);
			this.windowing.on_event(_event);
			this.input.on_event(_event);
		}
		this.host.onevent(_event);
		let _g = _event.type;
		if(_g != null) switch(_g) {
		case 1:
			this.on_flu_init();
			break;
		case 2:
			this.on_flu_ready();
			break;
		case 3:
			this.on_flu_update();
			break;
		case 7:case 8:
			this.shutdown();
			break;
		case 4:
			console.log("     i / fluidState / " + "Goodbye.");
			break;
		default:
		} else {
		}
	}
	,setup_app_path: function() {
	}
	,setup_configs: function() {
		let _g = this;
		if(this.flu_config.config_path == "") {
			this.setup_host_config();
			return flu_api_Promise.resolve();
		}
		return new flu_api_Promise(function(resolve,reject) {
			_g.default_runtime_config().then(function(_runtime_conf) {
				_g.config.runtime = _runtime_conf;
			}).error(function(error) {
				throw new js__$Boot_FluidError(flu_types_Error.init("config / failed / default runtime config failed to parse as JSON. cannot recover. " + error));
			}).then(function() {
				_g.setup_host_config();
				resolve();
			});
		});
	}
	,setup_host_config: function() {
		this.config = this.host.config(this.config);
	}
	,setup_default_window: function() {
		if(this.config.has_window == true) {
			this.window = this.windowing.create(this.config.window);
			if(this.window.handle == null) throw new js__$Boot_FluidError(flu_types_Error.windowing("requested default window cannot be created. cannot continue"));
		} else {
		}
	}
	,default_config: function() {
		return { has_window : true, runtime : { }, window : this.default_window_config(), render : this.default_render_config(), web : { no_context_menu : true, prevent_default_keys : [flu_system_input_Keycodes.left,flu_system_input_Keycodes.right,flu_system_input_Keycodes.up,flu_system_input_Keycodes.down,flu_system_input_Keycodes.backspace,flu_system_input_Keycodes.tab,flu_system_input_Keycodes["delete"]], prevent_default_mouse_wheel : true, true_fullscreen : false}};
	}
	,default_runtime_config: function() {
		let _g = this;
		return new flu_api_Promise(function(resolve,reject) {
			let load = _g.io.data_flow(flu_io_Path.join([_g.assets.root,_g.flu_config.config_path]),flu_system_assets_AssetJSON.processor);
			load.then(resolve).error(function(error) {
				switch(error[1]) {
				case 3:
					reject(error);
					break;
				default:
					resolve();
				}
			});
		});
	}
	,default_render_config: function() {
		return { depth : false, stencil : false, antialiasing : 0, red_bits : 8, green_bits : 8, blue_bits : 8, alpha_bits : 8, depth_bits : 0, stencil_bits : 0, opengl : { minor : 0, major : 0, profile : 0}};
	}
	,default_window_config: function() {
		let conf = { fullscreen_desktop : true, fullscreen : false, borderless : false, resizable : true, x : 536805376, y : 536805376, width : 800, height : 600};
		return conf;
	}
	,__class__: flu
};
let flu_api_Promise = function(func) {
	this.was_caught = false;
	let _g = this;
	this.state = 0;
	this.reject_reactions = [];
	this.fulfill_reactions = [];
	this.settle_reactions = [];
	flu_api_Promises.queue(function() {
		func($bind(_g,_g.onfulfill),$bind(_g,_g.onreject));
		flu_api_Promises.defer(flu_api_Promises.next);
	});
};
$hxClasses["fluidState.api.Promise"] = flu_api_Promise;
flu_api_Promise.__name__ = true;
flu_api_Promise.reject = function(reason) {
	return new flu_api_Promise(function(ok,no) {
		no(reason);
	});
};
flu_api_Promise.resolve = function(val) {
	return new flu_api_Promise(function(ok,no) {
		ok(val);
	});
};
flu_api_Promise.prototype = {
	then: function(on_fulfilled,on_rejected) {
		let _g = this.state;
		switch(_g) {
		case 0:
			this.add_fulfill(on_fulfilled);
			this.add_reject(on_rejected);
			return this.new_linked_promise();
		case 1:
			flu_api_Promises.defer(on_fulfilled,this.result);
			return flu_api_Promise.resolve(this.result);
		case 2:
			flu_api_Promises.defer(on_rejected,this.result);
			return flu_api_Promise.reject(this.result);
		}
	}
	,error: function(on_rejected) {
		let _g = this.state;
		switch(_g) {
		case 0:
			this.add_reject(on_rejected);
			return this.new_linked_resolve_empty();
		case 1:
			return flu_api_Promise.resolve(this.result);
		case 2:
			flu_api_Promises.defer(on_rejected,this.result);
			return flu_api_Promise.reject(this.result);
		}
	}
	,add_settle: function(f) {
		if(this.state == 0) this.settle_reactions.push(f); else flu_api_Promises.defer(f,this.result);
	}
	,new_linked_promise: function() {
		let _g = this;
		return new flu_api_Promise(function(f,r) {
			_g.add_settle(function(_) {
				if(_g.state == 1) f(_g.result); else r(_g.result);
			});
		});
	}
	,new_linked_resolve_empty: function() {
		let _g = this;
		return new flu_api_Promise(function(f,r) {
			_g.add_settle(function(_) {
				f();
			});
		});
	}
	,add_fulfill: function(f) {
		if(f != null) this.fulfill_reactions.push(f);
	}
	,add_reject: function(f) {
		if(f != null) {
			this.was_caught = true;
			this.reject_reactions.push(f);
		}
	}
	,onfulfill: function(val) {
		this.state = 1;
		this.result = val;
		while(this.fulfill_reactions.length > 0) {
			let fn = this.fulfill_reactions.shift();
			fn(this.result);
		}
		this.onsettle();
	}
	,onreject: function(reason) {
		this.state = 2;
		this.result = reason;
		while(this.reject_reactions.length > 0) {
			let fn = this.reject_reactions.shift();
			fn(this.result);
		}
		this.onsettle();
	}
	,onsettle: function() {
		while(this.settle_reactions.length > 0) {
			let fn = this.settle_reactions.shift();
			fn(this.result);
		}
	}
	,__class__: flu_api_Promise
};
let flu_api_Promises = function() { };
$hxClasses["fluidState.api.Promises"] = flu_api_Promises;
flu_api_Promises.__name__ = true;
flu_api_Promises.step = function() {
	flu_api_Promises.next();
	while(flu_api_Promises.defers.length > 0) {
		let defer = flu_api_Promises.defers.shift();
		defer.f(defer.a);
	}
};
flu_api_Promises.next = function() {
	if(flu_api_Promises.calls.length > 0) (flu_api_Promises.calls.shift())();
};
flu_api_Promises.defer = function(f,a) {
	if(f == null) return;
	flu_api_Promises.defers.push({ f : f, a : a});
};
flu_api_Promises.queue = function(f) {
	if(f == null) return;
	flu_api_Promises.calls.push(f);
};
let flu_api_Timer = function() { };
$hxClasses["fluidState.api.Timer"] = flu_api_Timer;
flu_api_Timer.__name__ = true;
flu_api_Timer.update = function() {
	let now = flu.core.timestamp();
	let _g = 0;
	let _g1 = flu_api_Timer.running_timers;
	while(_g < _g1.length) {
		let timer = _g1[_g];
		++_g;
		if(timer.running) {
			if(timer.fire_at < now) {
				timer.fire_at += timer.time;
				timer.run();
			}
		}
	}
};
flu_api_Timer.prototype = {
	run: function() {
	}
	,__class__: flu_api_Timer
};
let flu_core_web_Core = function(_app) {
	this._time_now = 0.0;
	this._lf_timestamp = 0.016;
	this.start_timestamp = 0.0;
	this.app = _app;
	this.start_timestamp = this.timestamp();
	this.guess_os();
};

$hxClasses["fluidState.core.web.Core"] = flu_core_web_Core;
flu_core_web_Core.__name__ = true;
flu_core_web_Core.prototype = {
	init: function(_event_handler) {
		this.app.on_event({ type : 1});
		this.app.on_event({ type : 2});
		if(this.app.flu_config.has_loop) this.request_update();
	}
	,shutdown: function() {
	}
	,timestamp: function() {
		let now;
		if(window.performance != null) now = window.performance.now() / 1000.0; else now = flu_Timer.stamp();
		return now - this.start_timestamp;
	}
	,request_update: function() {
		let _g = this;
		if(($_=window,$bind($_,$_.requestAnimationFrame)) != null) window.requestAnimationFrame($bind(this,this.flu_core_loop)); else {
			console.log("     i / core / " + ("warning : requestAnimationFrame not found, falling back to render_rate! render_rate:" + this.app.host.render_rate));
			window.setTimeout(function() {
				let _now = _g.timestamp();
				_g._time_now += _now - _g._lf_timestamp;
				_g.flu_core_loop(_g._time_now * 1000.0);
				_g._lf_timestamp = _now;
			},this.app.host.render_rate * 1000.0 | 0);
		}
	}
	,flu_core_loop: function(_t) {
		if(_t == null) _t = 0.016;
		this.update();
		this.app.on_event({ type : 3});
		this.request_update();
		return true;
	}
	,update: function() {
	}
	,guess_os: function() {
	
	}
	,__class__: flu_core_web_Core
};

let flu_modules_interfaces_Assets = function() { };
$hxClasses["fluidState.modules.interfaces.Assets"] = flu_modules_interfaces_Assets;
flu_modules_interfaces_Assets.__name__ = true;
let flu_core_web_assets_Assets = function(_system) {
	this.system = _system;
};

$hxClasses["fluidState.core.web.assets.Assets"] = flu_core_web_assets_Assets;
flu_core_web_assets_Assets.__name__ = true;
flu_core_web_assets_Assets.__interfaces__ = [flu_modules_interfaces_Assets];
flu_core_web_assets_Assets.prototype = {
	__class__: flu_core_web_assets_Assets
};

let flu_modules_interfaces_Input = function() { };
$hxClasses["fluidState.modules.interfaces.Input"] = flu_modules_interfaces_Input;
flu_modules_interfaces_Input.__name__ = true;
let flu_system_input_Scancodes = function() { };
$hxClasses["fluidState.system.input.Scancodes"] = flu_system_input_Scancodes;
flu_system_input_Scancodes.__name__ = true;
let flu_system_input_Keycodes = function() { };
$hxClasses["fluidState.system.input.Keycodes"] = flu_system_input_Keycodes;
flu_system_input_Keycodes.__name__ = true;
flu_system_input_Keycodes.from_scan = function(scancode) {
	return scancode | flu_system_input_Scancodes.MASK;
};

let flu_core_web_input_Input = function(_system) {
	this.gamepads_supported = false;
	this.system = _system;
}
;
$hxClasses["fluidState.core.web.input.Input"] = flu_core_web_input_Input;
flu_core_web_input_Input.__name__ = true;
flu_core_web_input_Input.__interfaces__ = [flu_modules_interfaces_Input];
flu_core_web_input_Input.prototype = {
	init: function() {
		window.document.addEventListener("keypress",$bind(this,this.on_keypress));
		window.document.addEventListener("keydown",$bind(this,this.on_keydown));
		window.document.addEventListener("keyup",$bind(this,this.on_keyup));
		this.active_gamepads = new flu_ds_IntMap();
		this.gamepads_supported = this.get_gamepad_list() != null;
		if(window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation",$bind(this,this.on_orientation));
			window.addEventListener("devicemotion",$bind(this,this.on_motion));
		}
		console.log("    i / input / " + ("Gamepads supported: " + Std.string(this.gamepads_supported)));
	}
	,update: function() {
		if(this.gamepads_supported) this.poll_gamepads();
	}
	,destroy: function() {
	}
	,listen: function(window) {
		window.handle.addEventListener("contextmenu",$bind(this,this.on_contextmenu));
		window.handle.addEventListener("mousedown",$bind(this,this.on_mousedown));
		window.handle.addEventListener("mouseup",$bind(this,this.on_mouseup));
		window.handle.addEventListener("mousemove",$bind(this,this.on_mousemove));
		window.handle.addEventListener("mousewheel",$bind(this,this.on_mousewheel));
		window.handle.addEventListener("wheel",$bind(this,this.on_mousewheel));
		window.handle.addEventListener("touchstart",$bind(this,this.on_touchdown));
		window.handle.addEventListener("touchend",$bind(this,this.on_touchup));
		window.handle.addEventListener("touchmove",$bind(this,this.on_touchmove));
	}
	,on_event: function(_event) {
	}
	,on_orientation: function(event) {
		this.system.app.dispatch_system_event({ type : 6, input : { type : 4, timestamp : flu.core.timestamp(), event : { type : "orientation", alpha : event.alpha, beta : event.beta, gamma : event.gamma}}});
	}
	,on_motion: function(event) {
		this.system.app.dispatch_system_event({ type : 6, input : { type : 4, timestamp : flu.core.timestamp(), event : { type : "motion", acceleration : event.acceleration, accelerationIncludingGravity : event.accelerationIncludingGravity, rotationRate : event.rotationRate}}});
	}
	,poll_gamepads: function() {
		if(!this.gamepads_supported) return;
		let list = this.get_gamepad_list();
		if(list != null) {
			let _g1 = 0;
			let _g = list.length;
			while(_g1 < _g) {
				let i = _g1++;
				if(list[i] != null) this.handle_gamepad(list[i]); else {
					let _gamepad = this.active_gamepads.h[i];
					if(_gamepad != null) this.system.dispatch_gamepad_device_event(_gamepad.index,_gamepad.id,2,flu.core.timestamp());
					this.active_gamepads.remove(i);
				}
			}
		}
	}
	,handle_gamepad: function(_gamepad) {
		if(_gamepad == null) return;
		let tmp;
		let key = _gamepad.index;
		tmp = this.active_gamepads.h.hasOwnProperty(key);
		if(!tmp) {
			let _new_gamepad = { id : _gamepad.id, index : _gamepad.index, axes : [], buttons : [], timestamp : flu.core.timestamp()};
			let axes = _gamepad.axes;
			let _g = 0;
			while(_g < axes.length) {
				let value = axes[_g];
				++_g;
				_new_gamepad.axes.push(value);
			}
			let _button_list = _gamepad.buttons;
			let _g1 = 0;
			while(_g1 < _button_list.length) {
				++_g1;
				_new_gamepad.buttons.push({ pressed : false, value : 0});
			}
			this.active_gamepads.h[_new_gamepad.index] = _new_gamepad;
			this.system.dispatch_gamepad_device_event(_new_gamepad.index,_new_gamepad.id,1,_new_gamepad.timestamp);
		} else {
			let tmp1;
			let key1 = _gamepad.index;
			tmp1 = this.active_gamepads.h[key1];
			let gamepad = tmp1;
			if(gamepad.id != _gamepad.id) gamepad.id = _gamepad.id;
			let axes_changed = [];
			let buttons_changed = [];
			let last_axes = gamepad.axes;
			let last_buttons = gamepad.buttons;
			let new_axes = _gamepad.axes;
			let new_buttons = _gamepad.buttons;
			let axis_index = 0;
			let _g2 = 0;
			while(_g2 < new_axes.length) {
				let axis = new_axes[_g2];
				++_g2;
				if(axis != last_axes[axis_index]) {
					axes_changed.push(axis_index);
					gamepad.axes[axis_index] = axis;
				}
				axis_index++;
			}
			let button_index = 0;
			let _g3 = 0;
			while(_g3 < new_buttons.length) {
				let button = new_buttons[_g3];
				++_g3;
				if(button.value != last_buttons[button_index].value) {
					buttons_changed.push(button_index);
					gamepad.buttons[button_index].pressed = button.pressed;
					gamepad.buttons[button_index].value = button.value;
				}
				button_index++;
			}
			let _g4 = 0;
			while(_g4 < axes_changed.length) {
				let index = axes_changed[_g4];
				++_g4;
				this.system.dispatch_gamepad_axis_event(gamepad.index,index,new_axes[index],gamepad.timestamp);
			}
			let _g5 = 0;
			while(_g5 < buttons_changed.length) {
				let index1 = buttons_changed[_g5];
				++_g5;
				if(new_buttons[index1].pressed == true) this.system.dispatch_gamepad_button_down_event(gamepad.index,index1,new_buttons[index1].value,gamepad.timestamp); else this.system.dispatch_gamepad_button_up_event(gamepad.index,index1,new_buttons[index1].value,gamepad.timestamp);
			}
		}
	}
	,fail_gamepads: function() {
		this.gamepads_supported = false;
		console.log("    i / input / " + "Gamepads are not supported in this browser :(");
	}
	,get_gamepad_list: function() {
		if(($_=window.navigator,$bind($_,$_.getGamepads)) != null) return window.navigator.getGamepads();
		if(window.navigator.webkitGetGamepads != null) return window.navigator.webkitGetGamepads();
		this.fail_gamepads();
		return null;
	}
	,on_mousedown: function(_mouse_event) {
		let _window = this.system.app.windowing.window_from_handle(_mouse_event.target);
		this.system.dispatch_mouse_down_event(_mouse_event.pageX - window.pageXOffset - _window.x,_mouse_event.pageY - window.pageYOffset - _window.y,_mouse_event.button + 1,_mouse_event.timeStamp,_window.id);
	}
	,on_mouseup: function(_mouse_event) {
		let _window = this.system.app.windowing.window_from_handle(_mouse_event.target);
		this.system.dispatch_mouse_up_event(_mouse_event.pageX - window.pageXOffset - _window.x,_mouse_event.pageY - window.pageYOffset - _window.y,_mouse_event.button + 1,_mouse_event.timeStamp,_window.id);
	}
	,on_mousemove: function(_mouse_event) {
		let _window = this.system.app.windowing.window_from_handle(_mouse_event.target);
		let _movement_x = _mouse_event.movementX;
		let _movement_y = _mouse_event.movementY;
		if(_movement_x == null) {
			if(_mouse_event.webkitMovementX != null) {
				_movement_x = _mouse_event.webkitMovementX;
				_movement_y = _mouse_event.webkitMovementY;
			} else if(_mouse_event.mozMovementX != null) {
				_movement_x = _mouse_event.mozMovementX;
				_movement_y = _mouse_event.mozMovementY;
			}
		}
		this.system.dispatch_mouse_move_event(_mouse_event.pageX - window.pageXOffset - _window.x,_mouse_event.pageY - window.pageYOffset - _window.y,_movement_x,_movement_y,_mouse_event.timeStamp,_window.id);
	}
	,on_mousewheel: function(_wheel_event) {
		if(this.system.app.config.web.prevent_default_mouse_wheel) _wheel_event.preventDefault();
		let _window = this.system.app.windowing.window_from_handle(_wheel_event.target);
		let _x = 0;
		let _y = 0;
		if(_wheel_event.deltaY != null) _y = _wheel_event.deltaY; else if(_wheel_event.wheelDeltaY != null) _y = -_wheel_event.wheelDeltaY / 3 | 0;
		if(_wheel_event.deltaX != null) _x = _wheel_event.deltaX; else if(_wheel_event.wheelDeltaX != null) _x = -_wheel_event.wheelDeltaX / 3 | 0;
		this.system.dispatch_mouse_wheel_event(Math.round(_x / 16),Math.round(_y / 16),_wheel_event.timeStamp,_window.id);
	}
	,on_contextmenu: function(_event) {
		if(this.system.app.config.web.no_context_menu) _event.preventDefault();
	}
	,on_keypress: function(_key_event) {
		if(_key_event.which != 0 && HxOverrides.indexOf(flu_core_web_input_Input._keypress_blacklist,_key_event.keyCode,0) == -1) {
			let _text = String.fromCharCode(_key_event.charCode);
			this.system.dispatch_text_event(_text,0,_text.length,2,_key_event.timeStamp,1);
		}
	}
	,on_keydown: function(_key_event) {
		let _keycode = this.convert_keycode(_key_event.keyCode);
		let _scancode = flu_system_input_Keycodes.to_scan(_keycode);
		let _mod_state = this.mod_state_from_event(_key_event);
		if(HxOverrides.indexOf(this.system.app.config.web.prevent_default_keys,_keycode,0) != -1) _key_event.preventDefault();
		this.system.dispatch_key_down_event(_keycode,_scancode,_key_event.repeat,_mod_state,_key_event.timeStamp,1);
	}
	,on_keyup: function(_key_event) {
		let _keycode = this.convert_keycode(_key_event.keyCode);
		let _scancode = flu_system_input_Keycodes.to_scan(_keycode);
		let _mod_state = this.mod_state_from_event(_key_event);
		if(HxOverrides.indexOf(this.system.app.config.web.prevent_default_keys,_keycode,0) != -1) _key_event.preventDefault();
		this.system.dispatch_key_up_event(_keycode,_scancode,_key_event.repeat,_mod_state,_key_event.timeStamp,1);
	}
	,mod_state_from_event: function(_key_event) {
		let _none = !_key_event.altKey && !_key_event.ctrlKey && !_key_event.metaKey && !_key_event.shiftKey;
		return { none : _none, lshift : _key_event.shiftKey, rshift : _key_event.shiftKey, lctrl : _key_event.ctrlKey, rctrl : _key_event.ctrlKey, lalt : _key_event.altKey, ralt : _key_event.altKey, lmeta : _key_event.metaKey, rmeta : _key_event.metaKey, num : false, caps : false, mode : false, ctrl : _key_event.ctrlKey, shift : _key_event.shiftKey, alt : _key_event.altKey, meta : _key_event.metaKey};
	}
	,on_touchdown: function(_touch_event) {
		let _window = this.system.app.windowing.window_from_handle(_touch_event.target);
		let _g = 0;
		let _g1 = _touch_event.changedTouches;
		while(_g < _g1.length) {
			let touch = _g1[_g];
			++_g;
			let _x = 500 - window.pageXOffset - _window.x;
			let _y = 400 - window.pageYOffset - _window.y;
			_x = _x / _window.width;
			_y = _y / _window.height;
			this.system.dispatch_touch_down_event(_x,_y,touch.identifier,flu.core.timestamp());
		}
	}
	,on_touchup: function(_touch_event) {
		let _window = this.system.app.windowing.window_from_handle(_touch_event.target);
		let _g = 0;
		let _g1 = _touch_event.changedTouches;
		while(_g < _g1.length) {
			let touch = _g1[_g];
			++_g;
			let _x = touch.pageX - window.pageXOffset - _window.x;
			let _y = touch.pageY - window.pageYOffset - _window.y;
			_x = _x / _window.width;
			_y = _y / _window.height;
			this.system.dispatch_touch_up_event(_x,_y,touch.identifier,flu.core.timestamp());
		}
	}
	,on_touchmove: function(_touch_event) {
		let _window = this.system.app.windowing.window_from_handle(_touch_event.target);
		let _g = 0;
		let _g1 = _touch_event.changedTouches;
		while(_g < _g1.length) {
			let touch = _g1[_g];
			++_g;
			let _x = touch.pageX - window.pageXOffset - _window.x;
			let _y = touch.pageY - window.pageYOffset - _window.y;
			_x = _x / _window.width;
			_y = _y / _window.height;
			this.system.dispatch_touch_move_event(_x,_y,0,0,touch.identifier,flu.core.timestamp());
		}
	}
	,__class__: flu_core_web_input_Input
};
let flu_modules_interfaces_IO = function() { };
$hxClasses["fluidState.modules.interfaces.IO"] = flu_modules_interfaces_IO;
flu_modules_interfaces_IO.__name__ = true;
let flu_core_web_io_IO = function(_system) {
	this.system = _system;
};
$hxClasses["fluidState.core.web.io.IO"] = flu_core_web_io_IO;
flu_core_web_io_IO.__name__ = true;
flu_core_web_io_IO.__interfaces__ = [flu_modules_interfaces_IO];
flu_core_web_io_IO.prototype = {
	data_load: function(_path,_options) {
		return new flu_api_Promise(function(resolve,reject) {
			let _async = true;
			let _binary = true;
			if(_options != null) {
				if(_options.binary != null) _binary = _options.binary;
			}
			let request = new XMLHttpRequest();
			request.open("GET",_path,_async);
			if(_binary) request.overrideMimeType("text/plain; charset=x-user-defined"); else request.overrideMimeType("text/plain; charset=UTF-8");
			if(_async) request.responseType = "arraybuffer";
			request.onload = function(data) {
				if(request.status == 200) {
					let tmp;
					let elements = request.response;
					let this1;
					if(elements != null) this1 = new Uint8Array(elements); else this1 = null;
					tmp = this1;
					resolve(tmp);
				} else reject(flu_types_Error.error("request status was " + request.status + " / " + request.statusText));
			};
			request.send();
		});
	}
	,init: function() {
	}
	,update: function() {
	}
	,destroy: function() {
	}
	,on_event: function(_event) {
	}
	,__class__: flu_core_web_io_IO
};
let flu_modules_interfaces_Windowing = function() { };
$hxClasses["fluidState.modules.interfaces.Windowing"] = flu_modules_interfaces_Windowing;
flu_modules_interfaces_Windowing.__name__ = true;
let flu_core_web_window_Windowing = function(_system) {
	this._hidden_event_name = "";
	this._hidden_name = "";
	this._pre_fs_body_margin = "0";
	this._pre_fs_body_overflow = "0";
	this._pre_fs_height = 0;
	this._pre_fs_width = 0;
	this._pre_fs_s_height = "";
	this._pre_fs_s_width = "";
	this._pre_fs_margin = "0";
	this._pre_fs_padding = "0";
	this.seq_window = 1;
	this.system = _system;
	this.fs_windows = [];
	this.gl_contexts = new flu_ds_IntMap();
};
$hxClasses["fluidState.core.web.window.Windowing"] = flu_core_web_window_Windowing;
flu_core_web_window_Windowing.__name__ = true;
flu_core_web_window_Windowing.__interfaces__ = [flu_modules_interfaces_Windowing];
flu_core_web_window_Windowing.prototype = {
	init: function() {
		this.listen_for_visibility();
		this.listen_for_resize();
	}
	,update: function() {
	}
	,destroy: function() {
	}
	,_copy_config: function(_config) {
		return { borderless : _config.borderless, fullscreen : _config.fullscreen, fullscreen_desktop : _config.fullscreen_desktop, height : _config.height, no_input : _config.no_input, resizable : _config.resizable, title : _config.title, width : _config.width, x : _config.x, y : _config.y};
	}
	,create: function(render_config,_config,on_created) {
		let _window_id = this.seq_window;
		let tmp;
		let _this = window.document;
		tmp = _this.createElement("canvas");
		let _handle = tmp;
		let config = this._copy_config(_config);
		_handle.width = "100%";
		_handle.height = "0px";
		_handle.style.display = "block";
		_handle.style.position = "fixed";
		_handle.style.background = "#000";
		_handle.style.opacity = "1.0";
		document.getElementsByClassName("fluid")[0].appendChild(_handle);
		let _gl_context = js_html__$CanvasElement_CanvasUtil.getContextWebGL(_handle,{ alpha : false, premultipliedAlpha : false, antialias : render_config.antialiasing > 0});
		if(_gl_context == null) {
			let msg = "WebGL is required to run this!<br/><br/>";
			msg += "visit http://get.webgl.org/ for help <br/>";
			msg += "and contact the developer of the application";
			this.internal_fallback(msg);
			throw new js__$Boot_FluidError(flu_types_Error.windowing(msg));
		}
		if(flu_modules_opengl_web_GL.current_context == null) flu_modules_opengl_web_GL.current_context = _gl_context;
		this.gl_contexts.h[_window_id] = _gl_context;
		let _window_pos = this.get_real_window_position(_handle);
		config.x = _window_pos.x;
		config.y = _window_pos.y;
		if(config.title != null && config.title != "") window.document.title = config.title;
		on_created(_handle,_window_id,{ config : config, render_config : render_config});
		_handle.setAttribute("id","window" + _window_id);
		this.seq_window++;
	}
	,internal_resize: function(_window,_w,_h) {
		const ref = this;
		if (this.app.window.width >= 760) {
			setInterval(
				function() {
					ref.mousePointKnown = ref.mousePointKnown == false ? true : false;
				}, 500, ref
			);
		}
		this.system.app.dispatch_system_event({ type : 5, window : { type : 7, timestamp : flu.core.timestamp(), window_id : _window.id, event : { x : _w, y : _h}}});
		this.system.app.dispatch_system_event({ type : 5, window : { type : 6, timestamp : flu.core.timestamp(), window_id : _window.id, event : { x : _w, y : _h}}});
	}
	,update_window: function(_window) {
		let _rect = _window.handle.getBoundingClientRect();
		if(_rect.left != _window.x || _rect.top != _window.y) {
			let _event = { type : 5, window : { type : 5, timestamp : flu.core.timestamp(), window_id : _window.id, event : { x : _rect.left, y : _rect.top}}};
			this.system.app.on_event(_event);
		}
		if(_rect.width != _window.width || _rect.height != _window.height) this.internal_resize(_window,_rect.width,_rect.height);
		null;
	}
	,render: function(_window) {
		let _window_gl_context = this.gl_contexts.h[_window.id];
		if(flu_modules_opengl_web_GL.current_context != _window_gl_context) flu_modules_opengl_web_GL.current_context = _window_gl_context;
	}
	,swap: function(_window) {
	}
	,set_size: function(_window,w,h) {
		_window.handle.width = w;
		_window.handle.height = h;
		_window.handle.style.width = "" + w + "px";
		_window.handle.style.height = "" + h + "px";
		this.internal_resize(_window,w,h);
	}
	,set_position: function(_window,x,y) {
		_window.handle.style.left = "" + x + "px";
		_window.handle.style.top = "" + y + "px";
	}
	,get_real_window_position: function(handle) {
		let curleft = 0;
		let curtop = 0;
		let _obj = handle;
		let _has_parent = true;
		let _max_count = 0;
		while(_has_parent == true) {
			_max_count++;
			if(_max_count > 100) {
				_has_parent = false;
				break;
			}
			if(_obj.offsetParent != null) {
				curleft += _obj.offsetLeft;
				curtop += _obj.offsetTop;
				_obj = _obj.offsetParent;
			} else _has_parent = false;
		}
		return { x : curleft, y : curtop};
	}
	,set_max_size: function(_window,w,h) {
		_window.handle.style.maxWidth = "" + w + "px";
		_window.handle.style.maxHeight = "" + h + "px";
	}
	,set_min_size: function(_window,w,h) {
		_window.handle.style.minWidth = "" + w + "px";
		_window.handle.style.minHeight = "" + h + "px";
	}
	,internal_fullscreen: function(_window,fullscreen) {
		let _handle = _window.handle;
		if(fullscreen) {
			if(HxOverrides.indexOf(this.fs_windows,_window,0) == -1) this.fs_windows.push(_window);
		} else HxOverrides.remove(this.fs_windows,_window);
		let true_fullscreen = this.system.app.config.web.true_fullscreen;
		if(fullscreen) {
			if(true_fullscreen) {
				if($bind(_handle,_handle.requestFullscreen) == null) {
					if(_handle.requestFullScreen == null) {
						if(_handle.webkitRequestFullscreen == null) {
							if(_handle.mozRequestFullScreen == null) {
							} else _handle.mozRequestFullScreen();
						} else _handle.webkitRequestFullscreen();
					} else _handle.requestFullScreen(null);
				} else _handle.requestFullscreen();
			} else {
				this._pre_fs_padding = _handle.style.padding;
				this._pre_fs_margin = _handle.style.margin;
				this._pre_fs_s_width = _handle.style.width;
				this._pre_fs_s_height = _handle.style.height;
				this._pre_fs_width = _handle.width;
				this._pre_fs_height = _handle.height;
				this._pre_fs_body_margin = window.document.body.style.margin;
				this._pre_fs_body_overflow = window.document.body.style.overflow;
				_handle.style.margin = "0";
				_handle.style.padding = "0";
				_handle.style.width = window.innerWidth + "px";
				_handle.style.height = window.innerHeight + "px";
				_handle.width = window.innerWidth;
				_handle.height = window.innerHeight;
				window.document.body.style.margin = "0";
				window.document.body.style.overflow = "scroll";
			}
		} else if(true_fullscreen) {
		} else {
			_handle.style.padding = this._pre_fs_padding;
			_handle.style.margin = this._pre_fs_margin;
			_handle.style.width = this._pre_fs_s_width;
			_handle.style.height = this._pre_fs_s_height;
			_handle.width = this._pre_fs_width;
			_handle.height = this._pre_fs_height;
			window.document.body.style.margin = this._pre_fs_body_margin;
			window.document.body.style.overflow = this._pre_fs_body_overflow;
		}
	}
	,listen: function(_window) {
		_window.handle.addEventListener("mouseleave",$bind(this,this.on_internal_leave));
		_window.handle.addEventListener("mouseenter",$bind(this,this.on_internal_enter));
		if(_window.config.fullscreen) {
			this.internal_fullscreen(_window,_window.config.fullscreen);
			_window.config.width = _window.handle.width;
			_window.config.height = _window.handle.height;
		}
	}
	,on_internal_leave: function(_mouse_event) {
		let _window = this.system.window_from_handle(_mouse_event.target);
		this.system.app.dispatch_system_event({ type : 5, window : { type : 12, timestamp : _mouse_event.timeStamp, window_id : _window.id, event : _mouse_event}});
	}
	,on_internal_enter: function(_mouse_event) {
		let _window = this.system.window_from_handle(_mouse_event.target);
		this.system.app.dispatch_system_event({ type : 5, window : { type : 11, timestamp : _mouse_event.timeStamp, window_id : _window.id, event : _mouse_event}});
	}
	,listen_for_resize: function() {
		
		let _g = this;
		window.onresize = function(e) {
			if(!_g.system.app.config.web.true_fullscreen) {
				let _g1 = 0;
				let _g2 = _g.fs_windows;
				while(_g1 < _g2.length) {
					let $window = _g2[_g1];
					++_g1;
					$window.set_size(window.innerWidth,window.innerHeight);
					_g.internal_resize($window,$window.width,$window.height);
				}
			}
		};
	}
	,listen_for_visibility: function() {
		if(typeof document.hidden !== undefined) {
			this._hidden_name = "hidden";
			this._hidden_event_name = "visibilitychange";
		} else if(typeof document.mozHidden !== undefined ) {
			this._hidden_name = "mozHidden";
			this._hidden_name = "mozvisibilitychange";
		} else if(typeof document.msHidden !== "undefined") {
			this._hidden_name = "msHidden";
			this._hidden_event_name = "msvisibilitychange";
		} else if(typeof document.webkitHidden !== "undefined") {
			this._hidden_name = "webkitHidden";
			this._hidden_event_name = "webkitvisibilitychange";
		}
		if(this._hidden_name != "" && this._hidden_event_name != "") window.document.addEventListener(this._hidden_event_name,$bind(this,this.on_visibility_change));
	}
	,on_visibility_change: function(jsevent) {
		let _event = { type : 5, window : { type : 2, timestamp : flu.core.timestamp(), window_id : 1, event : jsevent}};
		if(document[this._hidden_name]) {
			_event.window.type = 3;
			this.system.app.dispatch_system_event(_event);
			_event.window.type = 8;
			this.system.app.dispatch_system_event(_event);
			_event.window.type = 14;
			this.system.app.dispatch_system_event(_event);
		} else {
			_event.window.type = 2;
			this.system.app.dispatch_system_event(_event);
			_event.window.type = 10;
			this.system.app.dispatch_system_event(_event);
			_event.window.type = 13;
			this.system.app.dispatch_system_event(_event);
		}
	}
	,internal_fallback: function(message) {
		let text_el;
		let overlay_el;
		let tmp;
		let _this = window.document;
		tmp = _this.createElement("div");
		text_el = tmp;
		let tmp1;
		let _this1 = window.document;
		tmp1 = _this1.createElement("div");
		overlay_el = tmp1;
		text_el.style.marginLeft = "auto";
		text_el.style.marginRight = "auto";
		text_el.style.color = "#d3d3d3";
		text_el.style.marginTop = "5em";
		text_el.style.fontSize = "1.4em";
		text_el.style.fontFamily = "helvetica,sans-serif";
		text_el.innerHTML = message;
		overlay_el.style.top = "0";
		overlay_el.style.left = "0";
		overlay_el.style.width = "100%";
		overlay_el.style.height = "100%";
		overlay_el.style.display = "block";
		overlay_el.style.minWidth = "100%";
		overlay_el.style.minHeight = "100%";
		overlay_el.style.textAlign = "center";
		overlay_el.style.position = "absolute";
		overlay_el.style.background = "rgba(1,1,1,0.90)";
		overlay_el.appendChild(text_el);
		window.document.body.appendChild(overlay_el);
	}
	,__class__: flu_core_web_window_Windowing
};

let flu_modules_opengl_web_GL = function() { };
$hxClasses["fluidState.modules.opengl.web.GL"] = flu_modules_opengl_web_GL;
flu_modules_opengl_web_GL.__name__ = true;
let flu_system_assets_Asset = function() { };
$hxClasses["fluidState.system.assets.Asset"] = flu_system_assets_Asset;
flu_system_assets_Asset.__name__ = true;
let flu_system_assets_AssetJSON = function() { };
$hxClasses["fluidState.system.assets.AssetJSON"] = flu_system_assets_AssetJSON;
flu_system_assets_AssetJSON.__name__ = true;
flu_system_assets_AssetJSON.processor = function(_app,_id,_data) {
	if(_data == null) return flu_api_Promise.reject(flu_types_Error.error("AssetJSON: data was null"));
	return new flu_api_Promise(function(resolve,reject) {
		let _data_json = null;
		try {
			_data_json = JSON.parse(new flu_io_Bytes(new Uint8Array(_data.buffer)).toString());
		} catch( e ) {
			if (e instanceof js__$Boot_FluidError) e = e.val;
			return reject(flu_types_Error.parse(e));
		}
		return resolve(_data_json);
	});
};
flu_system_assets_AssetJSON.__super__ = flu_system_assets_Asset;
flu_system_assets_AssetJSON.prototype = $extend(flu_system_assets_Asset.prototype,{
	__class__: flu_system_assets_AssetJSON
});
let flu_system_assets_Assets = function(_app) {
	this.root = "";
	this.app = _app;
	this.module = new flu_core_web_assets_Assets(this);
};
$hxClasses["fluidState.system.assets.Assets"] = flu_system_assets_Assets;
flu_system_assets_Assets.__name__ = true;
flu_system_assets_Assets.prototype = {
	__class__: flu_system_assets_Assets
};

let flu_system_input_Input = function(_app) {
	this.touch_count = 0;
	this.app = _app;
	this.module = new flu_core_web_input_Input(this);
	this.module.init();
	this.key_code_pressed = new flu_ds_IntMap();
	this.key_code_down = new flu_ds_IntMap();
	this.key_code_released = new flu_ds_IntMap();
	this.scan_code_pressed = new flu_ds_IntMap();
	this.scan_code_down = new flu_ds_IntMap();
	this.scan_code_released = new flu_ds_IntMap();
	this.mouse_button_pressed = new flu_ds_IntMap();
	this.mouse_button_down = new flu_ds_IntMap();
	this.mouse_button_released = new flu_ds_IntMap();
	this.gamepad_button_pressed = new flu_ds_IntMap();
	this.gamepad_button_down = new flu_ds_IntMap();
	this.gamepad_button_released = new flu_ds_IntMap();
	this.gamepad_axis_values = new flu_ds_IntMap();
	this.touches_down = new flu_ds_IntMap();
};
$hxClasses["fluidState.system.input.Input"] = flu_system_input_Input;
flu_system_input_Input.__name__ = true;
flu_system_input_Input.prototype = {
	dispatch_key_down_event: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		if(!repeat) {
			this.key_code_pressed.h[keycode] = false;
			this.key_code_down.h[keycode] = true;
			this.scan_code_pressed.h[scancode] = false;
			this.scan_code_down.h[scancode] = true;
		}
		this.app.host.onkeydown(keycode,scancode,repeat,mod,timestamp,window_id);
	}
	,dispatch_key_up_event: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		this.key_code_released.h[keycode] = false;
		this.key_code_down.remove(keycode);
		this.scan_code_released.h[scancode] = false;
		this.scan_code_down.remove(scancode);
		this.app.host.onkeyup(keycode,scancode,repeat,mod,timestamp,window_id);
	}
	,dispatch_text_event: function(text,start,length,type,timestamp,window_id) {
		this.app.host.ontextinput(text,start,length,type,timestamp,window_id);
	}
	,dispatch_mouse_move_event: function(x,y,xrel,yrel,timestamp,window_id) {
		this.app.host.onmousemove(x,y,xrel,yrel,timestamp,window_id);
	}
	,dispatch_mouse_down_event: function(x,y,button,timestamp,window_id) {
		this.mouse_button_pressed.h[button] = false;
		this.mouse_button_down.h[button] = true;
		this.app.host.onmousedown(x,y,button,timestamp,window_id);
	}
	,dispatch_mouse_up_event: function(x,y,button,timestamp,window_id) {
		this.mouse_button_released.h[button] = false;
		this.mouse_button_down.remove(button);
		this.app.host.onmouseup(x,y,button,timestamp,window_id);
	}
	,dispatch_mouse_wheel_event: function(x,y,timestamp,window_id) {
		this.app.host.onmousewheel(x,y,timestamp,window_id);
	}
	,dispatch_touch_down_event: function(x,y,touch_id,timestamp) {
		if(!this.touches_down.h.hasOwnProperty(touch_id)) {
			this.touch_count++;
			this.touches_down.h[touch_id] = true;
		}
		this.app.host.ontouchdown(x,y,touch_id,timestamp);
	}
	,dispatch_touch_up_event: function(x,y,touch_id,timestamp) {
		this.app.host.ontouchup(x,y,touch_id,timestamp);
		if(this.touches_down.remove(touch_id)) this.touch_count--;
	}
	,dispatch_touch_move_event: function(x,y,dx,dy,touch_id,timestamp) {
		this.app.host.ontouchmove(x,y,dx,dy,touch_id,timestamp);
	}
	,dispatch_gamepad_axis_event: function(gamepad,axis,value,timestamp) {
		if(!this.gamepad_axis_values.h.hasOwnProperty(gamepad)) {
			let value1 = new flu_ds_IntMap();
			this.gamepad_axis_values.h[gamepad] = value1;
		}
		let this1 = this.gamepad_axis_values.h[gamepad];
		this1.set(axis,value);
		this.app.host.ongamepadaxis(gamepad,axis,value,timestamp);
	}
	,dispatch_gamepad_button_down_event: function(gamepad,button,value,timestamp) {
		if(!this.gamepad_button_pressed.h.hasOwnProperty(gamepad)) {
			let value1 = new flu_ds_IntMap();
			this.gamepad_button_pressed.h[gamepad] = value1;
		}
		if(!this.gamepad_button_down.h.hasOwnProperty(gamepad)) {
			let value2 = new flu_ds_IntMap();
			this.gamepad_button_down.h[gamepad] = value2;
		}
		let this1 = this.gamepad_button_pressed.h[gamepad];
		this1.set(button,false);
		let this2 = this.gamepad_button_down.h[gamepad];
		this2.set(button,true);
		this.app.host.ongamepaddown(gamepad,button,value,timestamp);
	}
	,dispatch_gamepad_button_up_event: function(gamepad,button,value,timestamp) {
		if(!this.gamepad_button_released.h.hasOwnProperty(gamepad)) {
			let value1 = new flu_ds_IntMap();
			this.gamepad_button_released.h[gamepad] = value1;
		}
		if(!this.gamepad_button_down.h.hasOwnProperty(gamepad)) {
			let value2 = new flu_ds_IntMap();
			this.gamepad_button_down.h[gamepad] = value2;
		}
		let this1 = this.gamepad_button_released.h[gamepad];
		this1.set(button,false);
		let this2 = this.gamepad_button_down.h[gamepad];
		this2.remove(button);
		this.app.host.ongamepadup(gamepad,button,value,timestamp);
	}
	,dispatch_gamepad_device_event: function(gamepad,id,type,timestamp) {
		this.app.host.ongamepaddevice(gamepad,id,type,timestamp);
	}
	,listen: function(_window) {
		this.module.listen(_window);
	}
	,on_event: function(_event) {
		this.module.on_event(_event);
	}
	,update: function() {
		this.module.update();
		this._update_keystate();
		this._update_gamepadstate();
		this._update_mousestate();
	}
	,destroy: function() {
		this.module.destroy();
	}
	,_update_mousestate: function() {
		let $it0 = this.mouse_button_pressed.keys();
		while( $it0.hasNext() ) {
			let _code = $it0.next();
			if(this.mouse_button_pressed.h[_code]) this.mouse_button_pressed.remove(_code); else this.mouse_button_pressed.h[_code] = true;
		}
		let $it1 = this.mouse_button_released.keys();
		while( $it1.hasNext() ) {
			let _code1 = $it1.next();
			if(this.mouse_button_released.h[_code1]) this.mouse_button_released.remove(_code1); else this.mouse_button_released.h[_code1] = true;
		}
	}
	,_update_gamepadstate: function() {
		let $it0 = this.gamepad_button_pressed.iterator();
		while( $it0.hasNext() ) {
			let _gamepad_pressed = $it0.next();
			let $it1 = _gamepad_pressed.keys();
			while( $it1.hasNext() ) {
				let _button = $it1.next();
				if(_gamepad_pressed.h[_button]) _gamepad_pressed.remove(_button); else _gamepad_pressed.h[_button] = true;
			}
		}
		let $it2 = this.gamepad_button_released.iterator();
		while( $it2.hasNext() ) {
			let _gamepad_released = $it2.next();
			let $it3 = _gamepad_released.keys();
			while( $it3.hasNext() ) {
				let _button1 = $it3.next();
				if(_gamepad_released.h[_button1]) _gamepad_released.remove(_button1); else _gamepad_released.h[_button1] = true;
			}
		}
	}
	,_update_keystate: function() {
		let $it0 = this.key_code_pressed.keys();
		while( $it0.hasNext() ) {
			let _code = $it0.next();
			if(this.key_code_pressed.h[_code]) this.key_code_pressed.remove(_code); else this.key_code_pressed.h[_code] = true;
		}
		let $it1 = this.key_code_released.keys();
		while( $it1.hasNext() ) {
			let _code1 = $it1.next();
			if(this.key_code_released.h[_code1]) this.key_code_released.remove(_code1); else this.key_code_released.h[_code1] = true;
		}
		let $it2 = this.scan_code_pressed.keys();
		while( $it2.hasNext() ) {
			let _code2 = $it2.next();
			if(this.scan_code_pressed.h[_code2]) this.scan_code_pressed.remove(_code2); else this.scan_code_pressed.h[_code2] = true;
		}
		let $it3 = this.scan_code_released.keys();
		while( $it3.hasNext() ) {
			let _code3 = $it3.next();
			if(this.scan_code_released.h[_code3]) this.scan_code_released.remove(_code3); else this.scan_code_released.h[_code3] = true;
		}
	}
	,__class__: flu_system_input_Input
};
let flu_system_io_IO = function(_app) {
	this.app = _app;
	this.module = new flu_core_web_io_IO(this);
	this.module.init();
};
$hxClasses["fluidState.system.io.IO"] = flu_system_io_IO;
flu_system_io_IO.__name__ = true;
flu_system_io_IO.prototype = {
	data_flow: function(_id,_processor,_provider) {
		let _g = this;
		if(_provider == null) _provider = $bind(this,this.default_provider);
		return new flu_api_Promise(function(resolve,reject) {
			_provider(_g.app,_id).then(function(data) {
				if(_processor != null) _processor(_g.app,_id,data).then(resolve,reject); else resolve(data);
			}).error(reject);
		});
	}
	,default_provider: function(_app,_id) {
		return this.module.data_load(_id,null);
	}
	,__class__: flu_system_io_IO
};
let flu_system_window_Window = function(_system,_config) {
	this.internal_resize = false;
	this.internal_position = false;
	this.minimized = false;
	this.closed = true;
	this.auto_render = true;
	this.auto_swap = true;
	this.height = 0;
	this.width = 0;
	this.y = 0;
	this.x = 0;
	this.set_max_size({ x : 0, y : 0});
	this.set_min_size({ x : 0, y : 0});
	this.system = _system;
	this.asked_config = _config;
	this.config = _config;
	if(this.config.x == null) this.config.x = 536805376;
	if(this.config.y == null) this.config.y = 536805376;
	this.system.module.create(this.system.app.config.render,_config,$bind(this,this.on_window_created));
};
$hxClasses["fluidState.system.window.Window"] = flu_system_window_Window;
flu_system_window_Window.__name__ = true;
flu_system_window_Window.prototype = {
	on_window_created: function(_handle,_id,_configs) {
		this.id = _id;
		this.handle = _handle;
		if(this.handle == null) {
			console.log("   i / window / " + "failed to create window");
			return;
		}
		this.closed = false;
		this.config = _configs.config;
		this.system.app.config.render = _configs.render_config;
		this.internal_position = true;
		this.set_x(this.config.x);
		this.set_y(this.config.y);
		this.internal_position = false;
		this.internal_resize = true;
		this.set_width(this.config.width);
		this.set_height(this.config.height);
		this.internal_resize = false;
		this.on_event({ type : 1, window_id : _id, timestamp : flu.core.timestamp(), event : { }});
	}
	,on_event: function(_event) {
		let _g = _event.type;
		if(_g != null) switch(_g) {
		case 5:
			this.internal_position = true;
			this.set_position(_event.event.x,_event.event.y);
			this.internal_position = false;
			break;
		case 6:
			this.internal_resize = true;
			this.set_size(_event.event.x,_event.event.y);
			this.internal_resize = false;
			break;
		case 7:
			this.internal_resize = true;
			this.set_size(_event.event.x,_event.event.y);
			this.internal_resize = false;
			break;
		case 8:
			this.minimized = true;
			break;
		case 10:
			this.minimized = false;
			break;
		default:
		} else {
		}
		if(this.onevent != null) this.onevent(_event);
	}
	,update: function() {
		if(this.handle != null && !this.closed) this.system.module.update_window(this);
	}
	,render: function() {
		if(this.minimized || this.closed) return;
		if(this.handle == null) return;
		this.system.module.render(this);
		if(this.onrender != null) {
			this.onrender(this);
			if(this.auto_swap) this.swap();
			return;
		}
		flu_modules_opengl_web_GL.current_context.clearColor(0,0,0,1.0);
		flu_modules_opengl_web_GL.current_context.clear(16384);
		if(this.auto_swap) this.swap();
	}
	,swap: function() {
		if(this.handle == null || this.closed || this.minimized) return;
		this.system.module.swap(this);
	}
	,get_max_size: function() {
		return this.max_size;
	}
	,get_min_size: function() {
		return this.min_size;
	}
	,set_x: function(_x) {
		this.x = _x;
		if(this.handle != null && !this.internal_position) this.system.module.set_position(this,this.x,this.y);
		return this.x;
	}
	,set_y: function(_y) {
		this.y = _y;
		if(this.handle != null && !this.internal_position) this.system.module.set_position(this,this.x,this.y);
		return this.y;
	}
	,set_width: function(_width) {
		this.width = _width;
		if(this.handle != null && !this.internal_resize) this.system.module.set_size(this,this.width,this.height);
		return this.width;
	}
	,set_height: function(_height) {
		this.height = _height;
		if(this.handle != null && !this.internal_resize) this.system.module.set_size(this,this.width,this.height);
		return this.height;
	}
	,set_position: function(_x,_y) {
		let last_internal_position_flag = this.internal_position;
		this.internal_position = true;
		this.set_x(_x);
		this.set_y(_y);
		this.internal_position = last_internal_position_flag;
		if(this.handle != null && !this.internal_position) this.system.module.set_position(this,this.x,this.y);
	}
	,set_size: function(_width,_height) {
		let last_internal_resize_flag = this.internal_resize;
		this.internal_resize = true;
		this.set_width(_width);
		this.set_height(_height);
		this.internal_resize = last_internal_resize_flag;
		if(this.handle != null && !this.internal_resize) this.system.module.set_size(this,_width,_height);
	}
	,set_max_size: function(_size) {
		if(this.get_max_size() != null && this.handle != null) this.system.module.set_max_size(this,_size.x,_size.y);
		return this.max_size = _size;
	}
	,set_min_size: function(_size) {
		if(this.get_min_size() != null && this.handle != null) this.system.module.set_min_size(this,_size.x,_size.y);
		return this.min_size = _size;
	}
	,__class__: flu_system_window_Window
};
let flu_system_window_Windowing = function(_app) {
	this.window_count = 0;
	this.app = _app;
	this.window_list = new flu_ds_IntMap();
	this.window_handles = new flu_ds_ObjectMap();
	this.module = new flu_core_web_window_Windowing(this);
	this.module.init();
};
$hxClasses["fluidState.system.window.Windowing"] = flu_system_window_Windowing;
flu_system_window_Windowing.__name__ = true;
flu_system_window_Windowing.prototype = {
	create: function(_config) {
		let _window = new flu_system_window_Window(this,_config);
		this.window_list.h[_window.id] = _window;
		this.window_handles.set(_window.handle,_window.id);
		this.window_count++;
		this.module.listen(_window);
		if(_config.no_input == null || _config.no_input == false) this.app.input.listen(_window);
		return _window;
	}
	,window_from_handle: function(_handle) {
		if(this.window_handles.h.__keys__[_handle.__id__] != null) {
			let _id = this.window_handles.h[_handle.__id__];
			return this.window_list.h[_id];
		}
		return null;
	}
	,on_event: function(_event) {
		if(_event.type == 5) {
			let _window_event = _event.window;
			let _window = this.window_list.h[_window_event.window_id];
			if(_window != null) _window.on_event(_window_event);
		}
	}
	,update: function() {
		this.module.update();
		let $it0 = this.window_list.iterator();
		while( $it0.hasNext() ) {
			let $window = $it0.next();
			$window.update();
		}
		let $it1 = this.window_list.iterator();
		while( $it1.hasNext() ) {
			let window1 = $it1.next();
			if(window1.auto_render) window1.render();
		}
	}
	,destroy: function() {
		this.module.destroy();
	}
	,__class__: flu_system_window_Windowing
};
let flu_types_Error = $hxClasses["fluidState.types.Error"] = { __ename__ : true, __constructs__ : ["error","init","windowing","parse"] };
flu_types_Error.error = function(value) { let $x = ["error",0,value]; $x.__enum__ = flu_types_Error; $x.toString = $estr; return $x; };
flu_types_Error.init = function(value) { let $x = ["init",1,value]; $x.__enum__ = flu_types_Error; $x.toString = $estr; return $x; };
flu_types_Error.windowing = function(value) { let $x = ["windowing",2,value]; $x.__enum__ = flu_types_Error; $x.toString = $estr; return $x; };
flu_types_Error.parse = function(value) { let $x = ["parse",3,value]; $x.__enum__ = flu_types_Error; $x.toString = $estr; return $x; };
flu_types_Error.__empty_constructs__ = [];
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
let $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; let f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
let Int = $hxClasses.Int = { __name__ : ["Int"]};
let Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
let Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
let Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
let Class = $hxClasses.Class = { __name__ : ["Class"]};
let Enum = { };
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	let a1 = [];
	let _g11 = 0;
	let _g2 = this.length;
	while(_g11 < _g2) {
		let i1 = _g11++;
		let e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
let __map_reserved = {}
let ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
let DataView = $global.DataView || js_html_compat_DataView;
let Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
gltoolbox_GeometryTools.unitQuadCache = new flu_ds_IntMap();
gltoolbox_TextureTools.defaultParams = { channelType : 6408, dataType : 5121, filter : 9728, wrapS : 33071, wrapT : 33071, unpackAlignment : 4, webGLFlipY : true};
js_Boot.__toStr = {}.toString;
gltoolbox_shaders_Resample.instance = new gltoolbox_shaders_Resample();
flu_ds_ObjectMap.count = 0;
flu_io_FPHelper.i64tmp = (function($this) {
	let $r;
	let x = new flu__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
shaderblox_glsl_GLSLTools.PRECISION_QUALIFIERS = ["lowp","mediump","highp"];
shaderblox_glsl_GLSLTools.STORAGE_QUALIFIER_TYPES = (function($this) {
	let $r;
	let _g = new flu_ds_StringMap();
	{
		let value = ["bool","int","float","vec2","vec3","vec4","bvec2","bvec3","bvec4","ivec2","ivec3","ivec4","mat2","mat3","mat4"];
		if(__map_reserved["const"] != null) _g.setReserved("const",value); else _g.h["const"] = value;
	}
	{
		let value1 = ["float","vec2","vec3","vec4","mat2","mat3","mat4"];
		if(__map_reserved.attribute != null) _g.setReserved("attribute",value1); else _g.h["attribute"] = value1;
	}
	{
		let value2 = ["bool","int","float","vec2","vec3","vec4","bvec2","bvec3","bvec4","ivec2","ivec3","ivec4","mat2","mat3","mat4","sampler2D","samplerCube"];
		if(__map_reserved.uniform != null) _g.setReserved("uniform",value2); else _g.h["uniform"] = value2;
	}
	{
		let value3 = ["float","vec2","vec3","vec4","mat2","mat3","mat4"];
		if(__map_reserved.varying != null) _g.setReserved("varying",value3); else _g.h["varying"] = value3;
	}
	$r = _g;
	return $r;
}(this));
shaderblox_uniforms_UTexture.lastActiveTexture = -1;
flu_api_Promises.calls = [];
flu_api_Promises.defers = [];
flu_api_Timer.running_timers = [];

SnowApp.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
