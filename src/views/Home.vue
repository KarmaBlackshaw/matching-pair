<script setup>
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const TOTAL_PAIRS = 20
const cards = ref([])

const totalMoves = ref(0)
const isSolved = ref(false)
const minMovesToSolve = useLocalStorage('minMovesToSolve', 0)

const matchDictionary = ref(new Set([]))

const openCards = reactive({
  first: null,
  second: null
})

const isReady = ref(true)

onMounted(async () => {
  await initCards()
})

async function initCards () {
  isReady.value = false

  const suits = Array.from({ length: TOTAL_PAIRS }, (_, index) => index + 1)

  const imagesUrlsBySuit = reactive({})
  for (let i = 0; i < suits.length; i++) {
    const suit = suits[i]

    const { url } = await fetch('https://picsum.photos/80')
    imagesUrlsBySuit[suit] = url
  }

  cards.value = suits
    .flatMap(suit => [suit, suit])
    .sort(() => (Math.random() > 0.5) ? 1 : -1)
    .map((suit, index) => ({
      value: suit,
      key: index,
      image: imagesUrlsBySuit[suit]
    }))

  isReady.value = true
}

async function openCard (suit) {
  if (openCards.first && openCards.first.key === suit.key) {
    return
  }

  totalMoves.value++

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

    if (matchDictionary.value.size === TOTAL_PAIRS) {
      isSolved.value = true

      minMovesToSolve.value = Math.min(minMovesToSolve.value || Infinity, totalMoves.value)
    }
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

async function reset () {
  await initCards()

  totalMoves.value = 0
  isSolved.value = 0
  matchDictionary.value.clear()
  openCards.first = null
  openCards.second = null
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
      <div class="flex flex-col gap-[10px]">
        <div
          v-if="isSolved"
          class="border border-emerald-600 rounded bg-emerald-500 shadow p-3 flex items-center gap-3"
        >
          <icon-ep:success-filled class="text-2xl" /> Solved!
        </div>
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">
            Matching Pair
          </h1>

          <div class="flex gap-1">
            <button
              class="rounded px-3 py-1 bg-gray-300 dark:bg-gray-500 select-none"
              @click="reset"
            >
              Reset
            </button>

            <base-theme-toggle />
          </div>
        </div>

        <div
          class="
            rounded p-5
            bg-gray-100 dark:bg-gray-700
            select-none
          "
        >
          <div>
            Total Moves: <b>{{ totalMoves }}</b>
          </div>
          <div>
            Min Moves: <b>{{ minMovesToSolve }}</b>
          </div>
        </div>

        <div
          class="
            grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 grid-flow-row gap-2
          "
        >
          <div
            v-for="suit in cards"
            :key="suit.key"
            class="
            rounded
            w-[80px] h-[80px]
            flex justify-center items-center
            cursor-pointer
            select-none
            overflow-hidden
          "
            :class="[isOpen(suit) && !matchDictionary.has(suit.value) ? 'border-none' : 'border']"
            @click="openCard(suit)"
          >
            <icon-flat-color-icons:checkmark
              v-if="matchDictionary.has(suit.value)"
              class="h-[30px] w-[30px]"
            />

            <template v-else>
              <div
                v-show="isOpen(suit)"
                class="h-full w-full bg-cover bg-no-repeat"
                :style="{
                  backgroundImage: `url(${suit.image})`
                }"
              >
              </div>

              <icon-simple-icons:ghostery
                v-if="!isOpen(suit)"
                class="h-[30px] w-[30px]"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>