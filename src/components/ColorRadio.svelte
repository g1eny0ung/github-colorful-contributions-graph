<script lang="ts">
  let {
    id,
    name,
    colors,
    value,
    checkedValue,
    onChange,
  }: {
    id: string
    name: string
    colors: string[]
    value: string
    checkedValue: string
    onChange: (value: any) => void
  } = $props()

  const handleOnChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    onChange(target.value)
  }
</script>

<label
  class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
  for={id}
>
  <input
    type="radio"
    {id}
    {name}
    class="radio radio-xs"
    value={checkedValue}
    checked={value === checkedValue}
    onchange={handleOnChange}
  />
  <div class="inline-flex items-center gap-2">
    {#each colors as color}
      <span class="w-4 h-4 rounded" style="background-color: {color}"></span>
    {/each}
  </div>
</label>
