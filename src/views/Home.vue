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
      <h1 class="text-2xl font-bold">
        Matching Pair
      </h1>

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
          w-[80px] h-[80px]
          flex justify-center items-center
          cursor-pointer
        "
        @click="openCard({
          item: suitItem,
          key: suitKey
        })"
      >
        <icon-flat-color-icons:checkmark
          v-if="matchDictionary.has(suitItem)"
          class="h-[30px] w-[30px]"
        />

        <template v-else>
          <span
            v-if="isOpen(suitItem, suitKey)"
            class="text-3xl font-poppins font-bold"
          >{{ suitItem }}</span>

          <icon-simple-icons:ghostery
            v-else
            class="h-[30px] w-[30px]"
          />
        </template>
      </div>
    </div>
  </div>
</template>