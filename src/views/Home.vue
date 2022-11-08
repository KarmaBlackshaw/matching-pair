<script setup>
const suits = [1, 2, 3, 4, 5, 6, 7, 8]
const doubledSuits = suits
  .flatMap(suit => [suit, suit])
  .sort(() => (Math.random() > 0.5) ? 1 : -1)

const openCards = reactive({
  first: null,
  second: null
})

const matchDictionary = ref(new Set([]))

function openCard ({ item, key }) {
  if (openCards.second) {

    openCards.first = null
    openCards.second = null
  }

  if (!openCards.first) {
    openCards.first = { item, key }
    return
  }

  openCards.second = { item, key }

  if (isMatch()) {
    matchDictionary.value.add(item)
  }

}

function isMatch () {
  return openCards.first.item === openCards.second.item
}

function isOpen (item, key) {
  const firstCardOpen = openCards.first?.item === item && openCards.first?.key === key
  const secondCardOpen = openCards.second?.item === item && openCards.second?.key === key

  return firstCardOpen || secondCardOpen
}

</script>

<template>
  <div>
    <div class="flex justify-between mb-2">
      <h1>Matching Pair</h1>

      <base-theme-toggle />
    </div>

    <div
      class="
      grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 grid-flow-row gap-2
    "
    >
      <div
        v-for="(suitItem, suitKey) in doubledSuits"
        :key="suitKey"
        class="
          border
          rounded
          p-6 sm:p-10
        "
        @click="openCard({
          item: suitItem,
          key: suitKey
        })"
      >
        {{
          matchDictionary.has(suitItem)
            ? '✔️'
            : isOpen(suitItem, suitKey) ? suitItem : 'X'
        }}
      </div>
    </div>
  </div>
</template>