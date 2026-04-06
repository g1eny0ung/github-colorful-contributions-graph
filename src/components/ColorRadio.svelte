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
  class="flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-base-200"
  for={id}
>
  <span class="inline-flex gap-1">
    {#each colors as color}
      <span class="w-4 h-4 rounded" style="background-color: {color}"></span>
    {/each}
  </span>
  <span class="text-sm font-medium capitalize">
    {id}
  </span>
  <input
    type="radio"
    {id}
    {name}
    class="radio radio-xs"
    value={checkedValue}
    checked={value === checkedValue}
    onchange={handleOnChange}
  />
</label>
