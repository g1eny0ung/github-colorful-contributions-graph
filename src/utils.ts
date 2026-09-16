export const defaultFills = {
  green: ['#eff2f5', '#aceebb', '#4ac26b', '#2da44e', '#116329'],
  blue: ['#eff2f5', '#caddf9', '#79b8ff', '#2188ff', '#005cc5'],
  purple: ['#eff2f5', '#e1d4fa', '#b392f0', '#8a63d2', '#5a32a3'],
  orange: ['#eff2f5', '#ffdfb6', '#ffb757', '#f68212', '#c24e00'],
  red: ['#eff2f5', '#ffc1c0', '#f97a82', '#d73a49', '#86181d'],
  cyan: ['#eff2f5', '#d2f4f4', '#7eddd3', '#12b5b0', '#08706d'],
  pink: ['#eff2f5', '#ffdae5', '#ff99b8', '#f45287', '#bf125d'],
  lime: ['#eff2f5', '#d9f99d', '#bef264', '#65a30d', '#365314'],
  halloween: ['#eff2f5', '#ffee4a', '#ffc501', '#fe9600', '#333'],
  monochromatic: ['#eff2f5', '#D0CBC8', '#BEBAB7', '#9A9590', '#443C3C'],
  'pastel-meadow': ['#eff2f5', '#BFD9B0', '#82B895', '#62977F', '#4F756A'],
  'crimson-noir': ['#eff2f5', '#F2A6B8', '#FF0B55', '#aa0c39', '#3A1020'],
}

export const darkFills = {
  green: ['#151b23', '#033a16', '#196c2e', '#2ea043', '#56d364'],
  blue: ['#151b23', '#0a3069', '#0969da', '#388bfd', '#79c0ff'],
  purple: ['#151b23', '#3c1e70', '#6e40c9', '#8957e5', '#d2a8ff'],
  orange: ['#151b23', '#4d1e00', '#9e3605', '#e36209', '#ffa657'],
  red: ['#151b23', '#490202', '#8e1519', '#da3633', '#ff7b72'],
  cyan: ['#151b23', '#00373d', '#008291', '#00bcd4', '#b2ebf2'],
  pink: ['#151b23', '#490628', '#b1105d', '#db61a2', '#f692ce'],
  lime: ['#151b23', '#242c05', '#4d5b12', '#82991b', '#d9f99d'],
  halloween: ['#151b23', '#631c03', '#bd561d', '#fa7a18', '#fddf68'],
  monochromatic: ['#151b23', '#251D1C', '#443C3C', '#9A9590', '#BEBAB7'],
  'pastel-meadow': ['#151b23', '#27463E', '#355447', '#56806C', '#A5D8B4'],
  'crimson-noir': ['#151b23', '#3A1020', '#aa0c39', '#FF0B55', '#F2A6B8'],
}

// Multi-color themes shown in the Color Themes tab.
export const themeFills = {
  'solarized-dark': ['#151b23', '#064573', '#2AA198', '#B58900', '#D33682'],
  'wild-horizon': ['#151b23', '#1B4D3E', '#0f63ab', '#E67E22', '#D9534F'],
  'pastel-nebula': ['#151b23', '#355C7D', '#A8E6CF', '#F8B195', '#C06C84'],
  'avengers-initiative': ['#151b23', '#1b48c4', '#2D6A4F', '#9E2A2B', '#FFB703'],
  'christmas-spirit': ['#F3F4F6', '#8E0413', '#CB0B0A', '#568D66', '#004733'],
}

export type FillKey = keyof typeof defaultFills | keyof typeof themeFills

export function reloadContentScript() {
  browser.runtime.sendMessage('runInject')
}

export function setSelectedFill(key: FillKey) {
  browser.storage.sync.set({
    gccUserSelectedFills: key,
  })

  reloadContentScript()
}
