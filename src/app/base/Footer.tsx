function Footer() {
  return (
    <footer>
      <div className="borderb relative mx-auto max-w-6xl overflow-hidden border-white px-4 py-12 xl:overflow-visible xl:px-0">
        <div className="relative grid grid-cols-1 gap-8 pb-24 lg:grid-cols-3">
          <div className="text-white">
            <a href="/" className="flex items-center gap-2 text-sm text-white">
              <span className="sr-only">Go to homepage</span>
              <svg
                className="h-6"
                viewBox="0 0 124 118"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_41_746)">
                  <ellipse
                    cx="22.9446"
                    cy="32.8521"
                    rx="22.9446"
                    ry="32.8521"
                    transform="matrix(0.687621 -0.726069 -0.726069 -0.687621 39.7057 98.4983)"
                    fill="currentColor"
                    fillOpacity="0.37"
                  />
                  <ellipse
                    cx="91.5161"
                    cy="59.2491"
                    rx="22.9446"
                    ry="32.8521"
                    transform="rotate(-133.442 91.5161 59.2491)"
                    fill="currentColor"
                    fillOpacity="0.37"
                  />
                  <foreignObject
                    x="13.5172"
                    y="17.8129"
                    width="57.4072"
                    height="83.9204"
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        backdropFilter: "blur(5.07px)",
                        clipPath: "url(#bgblur_1_41_746_clip_path)",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </foreignObject>
                  <ellipse
                    opacity="0.7"
                    data-figma-bg-blur-radius="10.1452"
                    cx="16.7843"
                    cy="32.7796"
                    rx="16.7843"
                    ry="32.7796"
                    transform="matrix(-0.959719 0.280963 0.280963 0.959719 49.1191 23.5981)"
                    fill="currentColor"
                  />
                  <foreignObject
                    x="52.1676"
                    y="18.2037"
                    width="57.4072"
                    height="83.9204"
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        backdropFilter: "blur(5.07px)",
                        clipPath: "url(#bgblur_2_41_746_clip_path)",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </foreignObject>
                  <ellipse
                    opacity="0.7"
                    data-figma-bg-blur-radius="10.1452"
                    cx="80.8712"
                    cy="60.1639"
                    rx="16.7843"
                    ry="32.7796"
                    transform="rotate(16.3177 80.8712 60.1639)"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath
                    id="bgblur_1_41_746_clip_path"
                    transform="translate(-13.5172 -17.8129)"
                  >
                    <ellipse
                      cx="16.7843"
                      cy="32.7796"
                      rx="16.7843"
                      ry="32.7796"
                      transform="matrix(-0.959719 0.280963 0.280963 0.959719 49.1191 23.5981)"
                    />
                  </clipPath>
                  <clipPath
                    id="bgblur_2_41_746_clip_path"
                    transform="translate(-52.1676 -18.2037)"
                  >
                    <ellipse
                      cx="80.8712"
                      cy="60.1639"
                      rx="16.7843"
                      ry="32.7796"
                      transform="rotate(16.3177 80.8712 60.1639)"
                    />
                  </clipPath>
                  <clipPath id="clip0_41_746">
                    <rect width="123.93" height="117.997" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
              Stellaris
            </a>
            <p className="text-base-500 mt-1 text-sm font-normal text-balance">
              Build with ❤️
            </p>
          </div>
        </div>
        {/* <div
          aria-hidden="true"
          className="bg-light-vertical-stripes clip-rect-inset pointer-events-none -mx-px mt-auto aspect-12/4 p-20"
        /> */}
      </div>
    </footer>
  )
}

export default Footer
