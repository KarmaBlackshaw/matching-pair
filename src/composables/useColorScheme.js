const isDark = useDark({
  selector: ':root',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})

export default () => {
  return {
    isDark,
    toggle: useToggle(isDark)
  }
}