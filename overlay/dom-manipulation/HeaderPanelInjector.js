/**
 * This class is responsible for injecting any styling or text from the Overlay config
 * into the header panel.
 */
class HeaderPanelInjector {
  constructor(config = {}) {
    /**
     * @type {string}
     */
    this.heading = config.heading;

    /**
     * @type {string}
     */
    this.subtitle = config.subtitle;

    /**
     * @type {string}
     */
    this.imageUrl = config.imageUrl;

    /**
     * @type {string}
     */
    this.backgroundColor = config.backgroundColor;

    /**
     * @type {string}
     */
    this.foregroundColor = config.foregroundColor;

    /**
     * @type {Element}
     */
    this.headerEl = document.querySelector('.js-OverlayHeader');
  }

  /**
   * Injects the Header Panel HTML and styling from the config into the DOM.
   */
  inject() {
    this._injectHeadingText();
    this._injectSubtitleText();
    this._injectImage();
    this._addStyling();
  }

  /**
   * Injects heading text into the existing panel heading element if heading text is
   * present in the config.
   */
  _injectHeadingText() {
    this.heading && this._injectText(this.heading, '.js-OverlayHeader-title');
  }

  /**
   * Injects subtitle text into the existing panel subtitle element if subtitle text is
   * present in the config.
   */
  _injectSubtitleText() {
    this.subtitle && this._injectText(this.subtitle, '.js-OverlayHeader-subtitle');
  }

  /**
   * Injects an image into the existing image wrapper element in the panel if an imageUrl
   * is present in the panel config.
   */
  _injectImage() {
    if (!this.imageUrl) {
      return;
    }

    const imageEl = document.createElement('img');
    imageEl.classList.add('OverlayHeader-image');
    imageEl.src = this.imageUrl;

    const imageWrapperEl = this.headerEl.querySelector('.js-OverlayHeader-imageWrapper');
    imageWrapperEl.appendChild(imageEl);
  }

  /**
   * Injects styling for the header from the config
   */
  _applyConfigStyling() {
    if (this.backgroundColor) {
      const darkerColor = this._pSBC(-0.55, this.backgroundColor);
      this.headerEl.style['background-color'] = this.backgroundColor; /* For browsers that do not support gradients */
      this.headerEl.style['background-image'] = `linear-gradient(${this.backgroundColor}, ${darkerColor})`;
    }

    if (this.foregroundColor) {
      this.headerEl.style.color = this.foregroundColor;
    }
  }

  // TODO (agrow) confirm its OK to use this "pimped JS" function
  /**
   * Shade, Blend and Convert a Web Color - Shade it darker or lighter, or blend it with a second
   * color, and can also pass it right thru but convert from Hex to RGB (Hex2RGB) or RGB to Hex
   * (RGB2Hex).
   *
   * Source: https://github.com/PimpTrizkit/PJs
   *
   * @param {percent} p percentage
   * @param {string} c0 color0, a HEX or RGB web color
   * @param {string} c1 color1, a HEX or RGB web color
   * @param {boolean} l Default is log blending, pass in true to use linear blending
   */
  _pSBC (p,c0,c1,l) {
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this._pSBCr)this._pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this._pSBCr(c0),P=p<0,t=c1&&c1!="c"?this._pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
  }
}
