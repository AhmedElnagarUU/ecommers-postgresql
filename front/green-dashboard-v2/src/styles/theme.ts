export const theme = {
  colors: {
    background: '#030303',
    card: 'transparent',
    primary: {
      gradient: 'from-gray-200 to-white',
      hoverGradient: 'from-white to-gray-200',
      text: 'black',
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      accent: 'text-gray-300',
    },
    input: {
      background: '#030303',
      text: 'text-gray-100',
      placeholder: 'text-gray-500',
      icon: 'text-gray-400',
    },
  },
  components: {
    card: {
      base: 'bg-transparent border-0 shadow-2xl',
      header: 'pb-8 text-center space-y-2',
      title: 'text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent',
    },
    input: {
      base: 'pl-11 py-6 text-base bg-[#030303] border-0 text-gray-100 placeholder:text-gray-500 focus:ring-0 focus:border-0',
      label: 'block text-sm font-medium text-gray-300',
    },
    button: {
      base: 'w-full py-6 text-lg font-semibold bg-gradient-to-r from-gray-200 to-white hover:from-white hover:to-gray-200 text-black border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]',
    },
    link: {
      base: 'font-semibold text-gray-300 hover:text-white transition-colors',
    },
  },
  layout: {
    blur: {
      circle: 'w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl',
    },
    container: {
      base: 'relative min-h-screen h-full w-full bg-[#030303] overflow-hidden',
      content: 'relative w-full max-w-[500px] mx-4',
    },
  },
} as const; 