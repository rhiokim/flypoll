module.exports = (code = 200, message = '', referer) => {
  referer = referer ? `<meta http-equiv="refresh" content="5; url=${referer}"></meta>` : ''

  return `
  <html>
    <head>
      ${referer}
    </head>
    <body>
      <div class="error error_${code}">
        <div class="text">
          <h1>${code}</h1>
          <div class="desc">
            <h2><span>Flypoll: ${message}</span><span>.</span></h2>
          </div>
        </div>
        <style>
          .error {
              color: #000;
              background: #fff;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              position: absolute;
              font-family: "SF UI Text", "Helvetica Neue", "Lucida Grande";
              text-align: center;
              padding-top: 20%;
          }

          .error.error_500,
          .error.error_404 {
            background: #fff;
          }
          .error.error_200 {
            color: rgb(0, 200, 83);
            background: #fff;
          h1,
          .desc {
            display: inline-block;
            vertical-align: top;
          }
          .desc {
            text-align: left;
            line-height: 49px;
            height: 49px;
            vertical-align: middle;
          }
          .shouldRetry .desc {
            height: 29px;
            margin-top: -18px;
          }
          h1,
          h2,
          h3 {
            margin: 0;
            padding: 0;
            font-weight: normal;
          }

          h1 {
            border-right: 1px solid rgba(0, 0, 0, .3);
            margin-right: 20px;
            padding: 10px 23px;
            font-size: 24px;
            font-weight: 500;
          }

          .shouldRetry h1 {
            padding: 16px 23px;
          }

          .dark h1 {
            border-right: 1px solid rgba(255, 255, 255, .3);
          }

          .shouldRetry h2,
          .shouldRetry h3 {
            margin: 3px 0;
          }

          h2 {
            font-size: 14px;
          }

          h3 {
            font-size: 11px;
            color: rgba(255, 255, 255, .68);
          }
        </style>
      </div>
    </body>
  </html>
`
}
