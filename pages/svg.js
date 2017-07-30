const Title = (text, noTitle) => {
  return noTitle
    ? ''
    : `<text id="Option-A" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif" font-size="12" font-weight="bold" letter-spacing="1" fill="#212529">
          <tspan x="0" y="12">${text}</tspan>
        </text>`
}

module.exports = (id, text, per = 0, voted = 0, config) => {
  const { width, barColor, marginLeft, marginTop } = config.style
  const { noTitle } = config
  const barWidth = width - 114
  const to = barWidth * per / 100
  const title = Title(text, noTitle)

  let marginL = 17 - marginLeft
  let marginT = 0 - marginTop
  let height = noTitle ? 36 : 58
  let barX = 0
  let barY = noTitle ? 0 : 19
  let barW = 0
  let barH = 14
  let perTextX = noTitle ? 11 : 30

  return `
    <svg width="${width}px" height="${height}px" viewBox="${marginL} ${marginT} ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="poll">
          <g id="Group" transform="translate(17.000000, 10.000000)">
            <rect id="Rectangle" fill="#F1F3F5" x="${barX}" y="${barY}" width="${width - 114}" height="${barH}" rx="2"></rect>
            <rect id="Rectangle" fill="${barColor}" x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="2">
              <animate attributeName="width"
                  begin="0.5s"
                  dur="600ms"
                  from="0"
                  to="${to}"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0; 1"
                  keySplines="0.3, 0.61, 0.355, 1" />
            </rect>
            <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif" font-size="12" font-weight="normal" letter-spacing="1.857333" fill="#212529">
              <tspan x="${barWidth + 10}" y="${perTextX}">${per}%</tspan>
            </text>
            ${title}
            <text font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif" font-size="12" font-weight="normal" letter-spacing="1" fill="#868E96">
              <tspan x="${barWidth + 52}" y="${perTextX}">${voted}</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>`
}
