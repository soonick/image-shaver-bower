var ImageShaver=function(e,t){this.options=t||{},this.resizeNodes=[],this.nodeHovered=!1,this.resizeNode=null,this.resizeNodeIndex=null,this.cropRectangle=null,this.container=e,this.createDom(),this.showOriginalImage()};ImageShaver.prototype.NODE_SIZE=8,ImageShaver.prototype.NODE_INCREASE=6,ImageShaver.prototype.NODE_HOVERED_CLASS="shaver-node-hovered",ImageShaver.prototype.CROP_HOVERED_CLASS="shaver-crop-hovered",ImageShaver.prototype.createDom=function(){this.original=document.createElement("CANVAS"),this.originalCtx=this.original.getContext("2d"),this.preview=document.createElement("CANVAS"),this.previewCtx=this.preview.getContext("2d"),this.original.className="shaver-original",this.preview.className="shaver-preview",this.container.innerHTML="",this.container.appendChild(this.original),this.container.appendChild(this.preview),this.original.setAttribute("height",this.original.clientHeight),this.original.setAttribute("width",this.original.clientWidth),this.preview.setAttribute("height",this.preview.clientHeight),this.preview.setAttribute("width",this.preview.clientWidth),this.addListeners()},ImageShaver.prototype.showOriginalImage=function(){if(this.options.image){var e=document.createElement("IMG");e.setAttribute("src",this.options.image),e.className="shaver-hidden-image",this.container.appendChild(e),this.hiddenImage=e,e.onload=function(){this.drawHiddenImage(),this.showCropRectangle()}.bind(this)}},ImageShaver.prototype.drawHiddenImage=function(){var e=this.hiddenImage.clientWidth,t=this.hiddenImage.clientHeight,i=this.original.clientWidth,s=this.original.clientHeight;if(e>i||t>s){var o=e/i,r=t/s;o>r?(e=parseInt(e/o,10),t=parseInt(t/o,10)):(e=parseInt(e/r,10),t=parseInt(t/r,10))}var n=parseInt((i-e)/2),a=parseInt((s-t)/2);this.originalCtx.drawImage(this.hiddenImage,n,a,e,t)},ImageShaver.prototype.calculateLargestRectangle=function(){var e=this.options.ratio[0]/this.options.ratio[1],t=this.original.clientHeight,i=this.original.clientWidth,s=i/t,o=0,r=0;return e!==s&&(e>s?(t=parseInt(i/e,10),r=(this.original.clientHeight-t)/2):(i=parseInt(t*e,10),o=(this.original.clientWidth-i)/2)),[o,r,i,t]},ImageShaver.prototype.updatePreview=function(){this.previewCtx.drawImage(this.original,this.cropRectangle[0],this.cropRectangle[1],this.cropRectangle[2],this.cropRectangle[3],0,0,this.preview.width,this.preview.height)},ImageShaver.prototype.showCropRectangle=function(){this.cropRectangle||(this.cropRectangle=this.calculateLargestRectangle());var e=this.cropRectangle;this.updatePreview(),this.originalCtx.rect(e[0],e[1],e[2],e[3]),this.originalCtx.stroke(),this.showResizeNodes(e)},ImageShaver.prototype.showResizeNodes=function(e){var t=this.NODE_SIZE,i=parseInt(t/2,10),s=[[e[0]-i,e[1]-i,t,t],[e[0]+e[2]-i,e[1]-i,t,t],[e[0]+e[2]-i,e[1]+e[3]-i,t,t],[e[0]-i,e[1]+e[3]-i,t,t]];this.resizeNodes=s,this.originalCtx.rect(s[0][0],s[0][1],s[0][2],s[0][3]),this.originalCtx.fillRect(s[0][0],s[0][1],s[0][2],s[0][3]),this.originalCtx.rect(s[1][0],s[1][1],s[1][2],s[1][3]),this.originalCtx.fillRect(s[1][0],s[1][1],s[1][2],s[1][3]),this.originalCtx.rect(s[2][0],s[2][1],s[2][2],s[2][3]),this.originalCtx.fillRect(s[2][0],s[2][1],s[2][2],s[2][3]),this.originalCtx.rect(s[3][0],s[3][1],s[3][2],s[3][3]),this.originalCtx.fillRect(s[3][0],s[3][1],s[3][2],s[3][3]),this.originalCtx.stroke()},ImageShaver.prototype.addListeners=function(){this.original.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.original.addEventListener("mousedown",this.activateMoveOrResizeMode.bind(this))},ImageShaver.prototype.handleMouseMove=function(e){this.addCropAreaMoveClass(e),this.highlightHoveredNode(e)},ImageShaver.prototype.addCropAreaMoveClass=function(e){this.isEventOnRectangle(e,this.cropRectangle)?this.original.classList.add(this.CROP_HOVERED_CLASS):this.original.classList.remove(this.CROP_HOVERED_CLASS)},ImageShaver.prototype.isEventOnRectangle=function(e,t){return e.offsetX>=t[0]&&e.offsetX<=t[0]+t[2]&&e.offsetY>=t[1]&&e.offsetY<=t[1]+t[3]?!0:!1},ImageShaver.prototype.isEventOnNode=function(e){for(var t=0;t<this.resizeNodes.length;t++)if(this.isEventOnRectangle(e,this.resizeNodes[t]))return this.resizeNodes[t]},ImageShaver.prototype.highlightHoveredNode=function(e){var t=this.isEventOnNode(e);return t?(this.originalCtx.fillRect(t[0]-parseInt(this.NODE_INCREASE/2,10),t[1]-parseInt(this.NODE_INCREASE/2,10),t[2]+this.NODE_INCREASE,t[3]+this.NODE_INCREASE),this.nodeHovered=!0,void this.original.classList.add(this.NODE_HOVERED_CLASS)):void(this.nodeHovered&&(this.nodeHovered=!1,this.original.classList.remove(this.NODE_HOVERED_CLASS),this.original.width=this.original.width,this.drawHiddenImage(),this.showCropRectangle()))},ImageShaver.prototype.activateMoveOrResizeMode=function(e){var t=!1;this.resizeNode=this.isEventOnNode(e),this.resizeNode?(t=!0,this.resizeNodeIndex=this.resizeNodes.indexOf(this.resizeNode),this.mouseMoveListener=this.resizeCropArea.bind(this)):this.isEventOnRectangle(e,this.cropRectangle)&&(t=!0,this.previousPosition=[e.offsetX,e.offsetY],this.mouseMoveListener=this.moveCropArea.bind(this)),t&&(this.mouseOutListener=this.deactivateMoveOrResizeMode.bind(this),this.mouseUpListener=this.deactivateMoveOrResizeMode.bind(this),this.original.addEventListener("mousemove",this.mouseMoveListener),this.original.addEventListener("mouseout",this.mouseOutListener),this.original.addEventListener("mouseup",this.mouseUpListener))},ImageShaver.prototype.moveCropArea=function(e){var t=[this.cropRectangle[0]-(this.previousPosition[0]-e.offsetX),this.cropRectangle[1]-(this.previousPosition[1]-e.offsetY),this.cropRectangle[2],this.cropRectangle[3]];this.previousPosition=[e.offsetX,e.offsetY],this.cropRectangle=t,this.original.width=this.original.width,this.drawHiddenImage(),this.showCropRectangle()},ImageShaver.prototype.deactivateMoveOrResizeMode=function(){this.original.removeEventListener("mousemove",this.mouseMoveListener),this.original.removeEventListener("mouseout",this.mouseOutListener),this.original.removeEventListener("mouseup",this.mouseUpListener),this.resizeNode=null,this.previousPosition=null},ImageShaver.prototype.calculateCropRectangleSize=function(e,t){var i,s,o,r,n,a=this.options.ratio;switch(e){case 0:i=this.cropRectangle[0]-t[0],s=t[0],r=this.cropRectangle[2]+i,n=parseInt(r*a[1]/a[0],10),o=this.cropRectangle[1]+(this.cropRectangle[3]-n);break;case 3:i=this.cropRectangle[0]-t[0],s=t[0],r=this.cropRectangle[2]+i,n=parseInt(r*a[1]/a[0],10),o=this.cropRectangle[1];break;case 1:i=this.cropRectangle[0]+this.cropRectangle[2]-t[0],s=this.cropRectangle[0],r=this.cropRectangle[2]-i,n=parseInt(r*a[1]/a[0],10),o=this.cropRectangle[1]+(this.cropRectangle[3]-n);break;case 2:i=this.cropRectangle[0]+this.cropRectangle[2]-t[0],s=this.cropRectangle[0],r=this.cropRectangle[2]-i,n=parseInt(r*a[1]/a[0],10),o=this.cropRectangle[1]}return[s,o,r,n]},ImageShaver.prototype.resizeCropArea=function(e){var t=this.calculateCropRectangleSize(this.resizeNodeIndex,[e.offsetX,e.offsetY]);this.original.width=this.original.width,this.drawHiddenImage(),this.cropRectangle=t,this.showCropRectangle()};