function Hero() {
  return (
    <section>
      <div className="relative w-full overflow-hidden px-8 pt-32 pb-12 xl:overflow-visible 2xl:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.6rem] -right-[0.65rem] z-51 hidden size-5 items-center justify-center lg:flex"
        >
          <div className="absolute h-[0.1px] w-full bg-white" />
          <div className="absolute h-full w-[0.1px] bg-white" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.6rem] -left-[0.65rem] z-51 hidden size-5 items-center justify-center lg:flex"
        >
          <div className="absolute h-[0.1px] w-full bg-white" />
          <div className="absolute h-full w-[0.1px] bg-white" />
        </div>
        <div
          aria-hidden="true"
          className="bg-base-vertical-stripes border-base-800 pointer-events-none absolute inset-0 -mx-px mt-auto h-24 border-t p-20"
        />
        <div className="relative text-center text-balance">
          <h1 className="font-display text-4xl tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Because you're too smart for slow, Fake-Sounding AI
          </h1>
          <p className="text-base-400 mx-auto mt-4 max-w-xl text-base">
            Runs on brain-melting math you’ll never have to touch. Built for
            devs who ship, not just talk.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 mx-auto max-w-2xl animate-pulse bg-white/30 blur" />
        </div>
      </div>
    </section>
  )
}

export default Hero
