"use client"

import Link from "next/link"
import ConnectWalletUI from "@/components/ConnectWalletUI"
import { Button } from "@/components/ui/button"

function Header() {
  return (
    <div
      id="nav-wrapper"
      className="bg-base-950 fixed inset-x-0 top-0 z-51 mx-auto w-full"
    >
      <div className="border-base-800 mx-auto max-w-6xl overflow-hidden border-b px-4 py-4 lg:py-8 xl:overflow-visible xl:px-0">
        <div
          id="navigation-wrapper"
          className="relative flex flex-col md:flex-row md:items-center md:justify-start md:gap-12"
        >
          <div className="flex flex-row items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-xs text-white">
              <span className="sr-only">Go to homepage</span>
              <svg
                className="h-8"
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
            <button
              className="outline-inset bg-base-800 hover:bg-base-700 focus:outline-base-700 flex size-9 items-center justify-center rounded-full text-center text-xs font-medium text-white transition-colors duration-500 ease-in-out focus:outline focus:outline-2 md:hidden"
              id="menu-toggle"
            >
              <svg
                className="size-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  id="menu-icon"
                  className="inline-flex"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  id="close-icon"
                  className="hidden"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav
            id="navigation-menu"
            className="pointer-events-none fixed inset-0 flex h-full -translate-y-4 transform flex-col justify-between bg-black py-12 opacity-0 transition-all duration-300 ease-in-out md:pointer-events-auto md:relative md:inset-auto md:w-full md:translate-y-0 md:bg-transparent md:bg-none md:p-0 md:opacity-100 lg:p-0"
          >
            <button
              className="outline-inset bg-base-800 hover:bg-base-700 focus:outline-base-700 absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-center text-xs font-medium text-white transition-colors duration-500 ease-in-out focus:outline focus:outline-2 md:hidden"
              id="menu-close"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-wave-x size-4"
                slot="icon"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" /> <path d="M6 6l12 12" />
              </svg>
            </button>
            <div className="relative flex h-full w-full flex-col items-start justify-start gap-12 overflow-hidden px-8 py-12 md:flex-row md:items-center md:px-0 md:py-0 md:text-left">
              <div
                aria-hidden="true"
                className="bg-accent-vertical-stripes pointer-events-none absolute inset-0 my-12 ml-auto block w-[10%] md:hidden"
              />
              <a href="/" className="md:hidden">
                <span className="sr-only">Go to homepage</span>
                <svg
                  className="h-12 text-white"
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
                      <rect
                        width="123.93"
                        height="117.997"
                        fill="currentColor"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <div className="relative flex flex-col gap-2 md:mr-auto md:flex-row md:gap-4">
                <Button className="cursor-pointer rounded-full" asChild>
                  <Link href="/create-agent">Create Agent</Link>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-full"
                  asChild
                >
                  <Link href="/agents">View Agents</Link>
                </Button>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                <ConnectWalletUI />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header
