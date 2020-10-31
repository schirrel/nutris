import { MutationTree, ActionTree } from 'vuex'
import {
  ManageDietsState,
  ManageDietsGetters,
  ManageDietsMutations,
  ManageDietsActions,
} from './types'
import FirebaseApp from '@/../firebaseApp'

import { Diet } from '@/models/Diet'
import { names } from '@/enums/collections/firebase'
import { UserGetters, USER_NAMESPACE } from '../user/types'
import { Snapshot } from '@/models/firebase'

const user = USER_NAMESPACE + '/' + UserGetters.USER

const state: ManageDietsState = {
  diets: [],
}

const getters = {
  [ManageDietsGetters.DIETS](state: ManageDietsState) {
    return state.diets
  },
}

const actions: ActionTree<ManageDietsState, {}> = {
  [ManageDietsActions.GET_DIETS]({ commit, rootGetters }) {
    return FirebaseApp.db
      .collection(names.users)
      .doc(rootGetters[user].uid)
      .collection(names.diets)
      .get()
      .then((querySnapshot: Snapshot[]) => {
        console.log('querySnapshot', querySnapshot)
        const diets: Diet[] = []
        querySnapshot.forEach((doc) => {
          diets.push({ ...doc.data(), id: doc.id } as Diet)
        })
        commit(ManageDietsMutations.GET_DIETS, diets)
      })
      .catch((error: Error) => error.message)
  },
  [ManageDietsActions.POST_DIETS]({ commit, rootGetters }, diet) {
    return FirebaseApp.db
      .collection(names.users)
      .doc(rootGetters[user].uid)
      .collection(names.diets)
      .add(diet)
      .then((doc: Snapshot) => {
        commit(ManageDietsMutations.POST_DIETS, { ...diet, id: doc.id })
      })
      .catch((error: Error) => error.message)
  },
  // saveLegacy() {
  // CHANGE DIETAS TO DIETS
  //   return (
  //     FirebaseApp.db
  //       .collection(names.users)
  //       .doc(rootGetters[user].uid)
  //       // .collection(names.diets)
  //       .collection('dietas')
  //       .get()
  //       .then((querySnapshot: Snapshot[]) => {
  //         const diets: any = []
  //         querySnapshot.forEach((doc: any) => {
  //           const { cal, protein, title } = doc.data().diet
  //           console.log('cal', cal)
  //           FirebaseApp.db
  //             .collection(names.users)
  //             .doc(rootGetters[user].uid)
  //             .collection(names.diets)
  //             .add({ name: title, calAmount: cal, proteinAmount: protein })
  //             .then((test: Snapshot) => {
  //               console.log('doc', test)
  //             })
  //             .catch((error: Error) => console.log(error.message))
  //         })
  //         commit(ManageDietsMutations.GET_DIETS, diets)
  //       })
  //       .catch((error: Error) => error)
  //   )
  // }
}

const mutations: MutationTree<ManageDietsState> = {
  [ManageDietsMutations.GET_DIETS](state, diets: Diet[]) {
    state.diets = diets
  },
  [ManageDietsMutations.POST_DIETS](state, diet: Diet) {
    state.diets.push(diet)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
