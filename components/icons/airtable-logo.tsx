export function AirtableLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M90.039 12.368 24.079 39.66c-3.667 1.519-3.63 6.729.062 8.192l66.235 26.266a24.58 24.58 0 0 0 17.913 0l66.235-26.266c3.69-1.463 3.729-6.673.062-8.192L108.626 12.368a24.58 24.58 0 0 0-18.587 0"
        fill="#FCB400"
      />
      <path
        d="M105.312 88.46v65.617c0 3.12 3.147 5.258 6.048 4.108l73.806-28.648a4.42 4.42 0 0 0 2.79-4.108V59.813c0-3.121-3.147-5.258-6.048-4.108l-73.806 28.648a4.42 4.42 0 0 0-2.79 4.108"
        fill="#18BFFF"
      />
      <path
        d="M92.264 89.81 74.669 97.2l-57.15 22.18c-2.85 1.106-6.137-.933-6.137-3.808V59.968c0-1.477.786-2.84 2.063-3.577.873-.503 1.897-.683 2.876-.49l.236.048 75.082 27.263c3.222 1.17 3.44 5.59.625 7.099"
        fill="#F82B60"
      />
      <path
        d="m92.264 89.81-75.482-27.405c-.98-.355-2.004-.206-2.876.29l78.357 41.238v-6.83a4.42 4.42 0 0 0-2.79-4.108l2.791-3.185"
        fill="#BA0D37"
        fillOpacity=".25"
      />
    </svg>
  )
}

export function AirtableWordmark({ className }: { className?: string }) {
  return <span className={className}>Airtable</span>
}

export function AirtableLogoMono({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.52 1.78 1.79 5.82c-.54.22-.53 1 .01 1.21l9.76 3.87c.44.17.93.17 1.37 0l9.76-3.87c.54-.21.55-.99.01-1.21l-9.72-4.04a2.45 2.45 0 0 0-1.46 0" />
      <path d="M12.76 13.06v9.67c0 .46.46.77.89.6l10.87-4.22c.27-.1.41-.37.41-.6V8.83c0-.46-.46-.77-.89-.6l-10.87 4.22c-.27.1-.41.37-.41.6" />
      <path d="M10.84 13.26l-2.59 1.09-8.42 3.27c-.42.16-.9-.14-.9-.56V8.88c0-.22.12-.42.3-.53.13-.07.28-.1.42-.07l11.05 4.02c.47.17.51.82.14 1.05" />
    </svg>
  )
}

export function AirtableLogoWhite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      {/* Top face */}
      <path d="M12 2L4 6.5V7L12 11.5L20 7V6.5L12 2Z" />
      {/* Left face */}
      <path d="M4 8L4 15L11 19V12L4 8Z" fillOpacity="0.7" />
      {/* Right face */}
      <path d="M20 8V15L13 19V12L20 8Z" fillOpacity="0.85" />
    </svg>
  )
}

export function OmniIcon({ className }: { className?: string }) {
  const dots = []
  const numDots = 12
  const radius = 8
  const centerX = 12
  const centerY = 12
  const dotRadius = 1.2

  for (let i = 0; i < numDots; i++) {
    const angle = (i * 2 * Math.PI) / numDots - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    dots.push(<circle key={i} cx={x} cy={y} r={dotRadius} fill="currentColor" />)
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {dots}
    </svg>
  )
}

export function BaseCubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Top face */}
      <path d="M12 2L4 6.5V7L12 11.5L20 7V6.5L12 2Z" />
      {/* Left face */}
      <path d="M4 8L4 15L11 19V12L4 8Z" fillOpacity="0.7" />
      {/* Right face */}
      <path d="M20 8V15L13 19V12L20 8Z" fillOpacity="0.85" />
    </svg>
  )
}
