<script setup>
const suits = [1, 2, 3, 4, 5, 6, 7, 8]

const doubledSuits = ref([])

const openCards = reactive({
  first: null,
  second: null
})

const sleep = time => new Promise(resolve => setTimeout(resolve, time))
const isReady = ref(false)

onMounted(async () => {
  const imagesUrlsBySuit = reactive({})
  for (let i = 0; i < suits.length; i++) {
    const suit = suits[i]

    const { url } = await fetch('https://picsum.photos/200/300')
    imagesUrlsBySuit[suit] = url
  }

  doubledSuits.value = suits
    .flatMap(suit => [suit, suit])
    .sort(() => (Math.random() > 0.5) ? 1 : -1)
    .map((suit, index) => ({
      value: suit,
      key: index,
      image: imagesUrlsBySuit[suit]
    }))

  isReady.value = true
})

const matchDictionary = ref(new Set([]))

async function openCard (suit) {
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
    await sleep(100)
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
    <div
      v-if="!isReady"
      class="flex flex-col justify-center items-center"
    >
      <icon-line-md:downloading-loop class="text-5xl" />

      Fetching images
    </div>

    <template v-else>
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
            rounded
            w-[80px] h-[80px]
            flex justify-center items-center
            cursor-pointer
            select-none
            overflow-hidden
          "
          :class="[isOpen(suit) ? 'border-none' : 'border']"
          @click="openCard(suit)"
        >
          <icon-flat-color-icons:checkmark
            v-if="matchDictionary.has(suit.value)"
            class="h-[30px] w-[30px]"
          />

          <template v-else>
            <div
              v-if="isOpen(suit)"
              class="h-full w-full bg-cover bg-no-repeat"
              :style="{
                backgroundImage: `url(${suit.image})`
              }"
            >
            </div>

            <icon-simple-icons:ghostery
              v-else
              class="h-[30px] w-[30px]"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>