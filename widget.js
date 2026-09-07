/*!
 * PayLink widget — embeddable USDC-on-Base payment request, zero signup.
 * Usage (drop-in, no build step):
 *   <script src="https://ipfs.io/ipfs/<CID>/widget.js"
 *           data-to="0xYourAddress" data-amt="25" data-memo="Invoice #1"></script>
 * Renders a QR + wallet-deeplink widget right at the script tag's position.
 * Multiple widgets on one page: use a container instead —
 *   <div data-paylink data-to="0x.." data-amt="10"></div>
 * Programmatic API: window.PayLink.buildURI(to, amt) -> EIP-681 string
 *                    window.PayLink.render(el, {to, amt, memo, size})
 * Everything runs client-side. No server, no tracking, no account.
 */
(function(){
  var USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  var CHAIN_ID = 8453;

  function buildURI(to, amt){
    if(!/^0x[a-fA-F0-9]{40}$/.test(to || "")) throw new Error("PayLink: invalid address");
    amt = parseFloat(amt);
    if(!(amt > 0)) throw new Error("PayLink: invalid amount");
    var units = Math.round(amt * 1e6); // USDC = 6 decimals
    return "ethereum:" + USDC_BASE + "@" + CHAIN_ID + "/transfer?address=" + to + "&uint256=" + units;
  }

  function qrUrl(uri, size){
    size = size || 200;
    return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size +
           "&data=" + encodeURIComponent(uri);
  }

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c];
    });
  }

  function render(el, opts){
    opts = opts || {};
    var to = opts.to, amt = opts.amt, memo = opts.memo || "", size = parseInt(opts.size, 10) || 200;
    var uri;
    try { uri = buildURI(to, amt); }
    catch(e){ el.textContent = e.message; return; }
    var qr = qrUrl(uri, size);
    el.innerHTML =
      '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:' + (size + 40) + 'px;' +
      'border:1px solid #2a2f3a;border-radius:12px;padding:14px;background:#12151d;color:#e8eaf0;text-align:center">' +
        '<img src="' + qr + '" width="' + size + '" height="' + size + '" ' +
          'style="border-radius:8px;background:#fff;padding:6px" alt="Scan to pay ' + esc(amt) + ' USDC">' +
        '<div style="margin-top:8px;font-size:0.85rem">' + (memo ? esc(memo) + " — " : "") +
          '<b>' + esc(amt) + ' USDC</b> on Base</div>' +
        '<a href="' + uri + '" style="display:block;margin-top:8px;font-size:0.78rem;color:#7ea3ff;word-break:break-all">' +
          'Open in wallet</a>' +
        '<div style="margin-top:6px;font-size:0.66rem;color:#7a8296">via PayLink — no signup, no fee, no middleman</div>' +
      '</div>';
  }

  function autoInit(){
    var containers = document.querySelectorAll("[data-paylink]");
    for(var i = 0; i < containers.length; i++){
      var el = containers[i];
      render(el, { to: el.getAttribute("data-to"), amt: el.getAttribute("data-amt"),
                    memo: el.getAttribute("data-memo"), size: el.getAttribute("data-size") });
    }
    var cur = document.currentScript;
    if(cur && cur.getAttribute("data-to")){
      var div = document.createElement("div");
      cur.parentNode.insertBefore(div, cur.nextSibling);
      render(div, { to: cur.getAttribute("data-to"), amt: cur.getAttribute("data-amt"),
                     memo: cur.getAttribute("data-memo"), size: cur.getAttribute("data-size") });
    }
  }

  window.PayLink = { buildURI: buildURI, qrUrl: qrUrl, render: render };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
})();
