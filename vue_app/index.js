import { firestore } from "./firebase.js";

const getTodos = async () => {
  const snapShot = await firestore.collection("todos").get();
  return snapShot.docs.map((doc) => ({
    id: doc.id,
    status: doc.data().status,
    task: doc.data().task,
  }));
};

const App = {
  data() {
    return {
      type: "add",
      todos: [],
      id: "",
      task: "",
      status: "",
    };
  },
  async created() {
    const todos = await getTodos();
    this.todos = todos;
  },
  methods: {
    getStatusName(status) {
      return status === 1
        ? "IMCOMPLETE"
        : status === 2
        ? "PROGRESS"
        : status === 3
        ? "PENDING  "
        : "COMPLETE";
    },
    async addItem() {
      const task = this.task;
      const status = this.status;
      await firestore.collection("todos").add({
        task,
        status: parseInt(status, 10),
        createdAt: new Date(),
      });
      const todos = await getTodos();
      this.todos = todos;
      this.resetForm();
    },
    async editItem() {
      const id = this.id;
      const task = this.task;
      const status = this.status;
      await firestore
        .collection("todos")
        .doc(id)
        .update({
          task,
          status: parseInt(status, 10),
        });
      const todos = await getTodos();
      this.todos = todos;
      this.resetForm();
    },
    async deleteItem(id) {
      await firestore.collection("todos").doc(id).delete();
      const todos = await getTodos();
      this.todos = todos;
    },
    selectEditItem(todo) {
      this.type = "edit";
      this.id = todo.id;
      this.task = todo.task;
      this.status = todo.status;
    },
    resetForm() {
      this.type = "add";
      this.id = "";
      this.task = "";
      this.status = "";
    },
  },
};

Vue.createApp(App).mount("#app");
