<script lang="ts">
  import ColorRadio from '@/components/ColorRadio.svelte'
  import Footer from '@/components/Footer.svelte'
  import Header from '@/components/Header.svelte'
  import {
    darkFills,
    defaultFills,
    setSelectedFill,
    themeFills,
  } from '@/utils'

  let pageTheme = $state('light')
  let userSelectedFill = $state('none')
  let activeSection = $state('colors')
  let fills = $derived(
    Object.entries(pageTheme === 'light' ? defaultFills : darkFills),
  )

  onMount(() => {
    browser.storage.sync.get(
      { theme: 'light', gccUserSelectedFills: 'none' },
      (result: { theme: 'light' | 'dark'; gccUserSelectedFills: string }) => {
        userSelectedFill = result.gccUserSelectedFills
        pageTheme = result.theme
        document.documentElement.setAttribute(
          'data-theme',
          result.theme === 'dark' ? 'forest' : 'light',
        )
      },
    )
  })
</script>

<main class="w-[500px] p-8 space-y-4">
  <Header />
  <div role="tablist" class="tabs tabs-boxed">
    <button
      role="tab"
      class:tab-active={activeSection === 'colors'}
      class="tab"
      onclick={() => (activeSection = 'colors')}>Single Colors</button
    >
    <button
      role="tab"
      class:tab-active={activeSection === 'themes'}
      class="tab"
      onclick={() => (activeSection = 'themes')}>Color Themes</button
    >
  </div>
  {#if activeSection === 'colors'}
    <section class="grid grid-cols-3">
      {#each fills as fill (fill[0])}
        <ColorRadio
          id={fill[0]}
          name="fill"
          colors={fill[1]}
          value={userSelectedFill}
          checkedValue={fill[0]}
          onChange={(value) => {
            userSelectedFill = value
            setSelectedFill(value)
          }}
        />
      {/each}
    </section>
  {:else}
    <section class="grid grid-cols-3">
      {#each Object.entries(themeFills) as fill (fill[0])}
        <ColorRadio
          id={fill[0]}
          name="fill"
          colors={fill[1]}
          value={userSelectedFill}
          checkedValue={fill[0]}
          onChange={(value) => {
            userSelectedFill = value
            setSelectedFill(value)
          }}
        />
      {/each}
    </section>
  {/if}
  <Footer />
</main>
