import Vue from "vue";
import io from "socket.io-client";
import EventBus from "../eventBus";

export default {
    data: () => ({
        socket: io(Vue.prototype.serverHost),
        logged_user: {},
        push_notification: {},
        notifications: []
    }),
    methods: {
        async initialize_notifications() {
            var login_p = this.axios.get(Vue.prototype.serverHost + "/student/login");
            var notification_p = this.axios.get(Vue.prototype.serverHost + "/notification");
            var result = await Promise.all([
                login_p.catch(() => { }), notification_p.catch(() => { })
            ]);
            this.logged_user = (result[0] == null) ? {} : result[0].data;
            this.notifications = (result[1] == null) ? [] : result[1].data;
            this.socket.emit("username", this.logged_user.username);
        },
        async read_notification(notification_id) {
            try {
                var response = await this.axios.put(Vue.prototype.serverHost + "/notification", { notification_id: notification_id });
                if (response.data != null) {
                    EventBus.$emit("NotificationRead", notification_id, response.data);
                }
            } catch (err) {
                return;
            }
        },
        async read_notification_and_jump(notification_id, notification_link) {
            var jump_p = this.$router.push(notification_link);
            var read_p = this.read_notification(notification_id);
            var result = await Promise.all([
                jump_p.catch(() => false), read_p
            ]);
            if (result[0] == false) {
                await this.$router.go();
            }
        },
        register_push_notification(notification) {
            this.notifications.push(notification);
            this.push_notification = notification;
        },
        async setup_ui_component() {
            await this.initialize_notifications();
            this.socket.on('notification', notification => this.register_push_notification(notification));
            EventBus.$on("Login", () => this.initialize_notifications());
            EventBus.$on("Logout", () => this.initialize_notifications());
            EventBus.$on("NotificationRead", (id, notification) => {
                var index = this.notifications.findIndex(not => not._id == id);
                this.notifications.splice(index, 1);
                this.notifications.push(notification);
            });
        }
    }
}