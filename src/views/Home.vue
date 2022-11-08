<script setup>
const suits = [1, 2, 3, 4, 5, 6, 7, 8]
const doubledSuits = suits
  .flatMap(suit => [suit, suit])
  .sort(() => (Math.random() > 0.5) ? 1 : -1)
  .map((item, index) => ({
    value: item,
    key: index
  }))

const openCards = reactive({
  first: null,
  second: null
})

const matchDictionary = ref(new Set([]))

function openCard (suit) {
  if (openCards.first && openCards.first.key === suit.key) {
    return
  }

  if (openCards.second) {
    openCards.first = null
    openCards.second = null
  }

  if (!openCards.first) {
    openCards.first = suit
    return
  }

  openCards.second = suit

  if (isMatch()) {
    matchDictionary.value.add(suit.value)
  }
}

function isMatch () {
  return openCards.first?.value === openCards.second?.value
}

function isOpen (suit) {
  const firstCardOpen = openCards.first?.value === suit.value && openCards.first?.key === suit.key
  const secondCardOpen = openCards.second?.value === suit.value && openCards.second?.key === suit.key

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
        v-for="suit in doubledSuits"
        :key="suit.key"
        class="
          border
          rounded
          w-[80px] h-[80px]
          flex justify-center items-center
          cursor-pointer
          select-none
        "
        @click="openCard(suit)"
      >
        <icon-flat-color-icons:checkmark
          v-if="matchDictionary.has(suit.value)"
          class="h-[30px] w-[30px]"
        />

        <template v-else>
          <span
            v-if="isOpen(suit)"
            class="text-3xl font-poppins font-bold"
          >
            {{ suit.value }}
          </span>

          <icon-simple-icons:ghostery
            v-else
            class="h-[30px] w-[30px]"
          />
        </template>
      </div>
    </div>
  </div>
</template>