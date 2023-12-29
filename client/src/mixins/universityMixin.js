import university_json from "../university.json";

export default {
    methods: {
        get_degree_courses() {
            return Object.keys(university_json).sort((a, b) => a.localeCompare(b));
        },
        get_degree_course_duration(course) {
            return Object.keys(university_json).includes(course) ? Object.keys(university_json[course]).length : null;
        },
        get_subjects() {
            var subjects = Object.keys(university_json).map(c => Object.keys(university_json[c]).map(y => university_json[c][y]));
            var merged_subjects = ([].concat.apply([], [].concat.apply([], subjects))).filter((item, index, self) => self.indexOf(item) == index);
            return merged_subjects.sort((a, b) => a.localeCompare(b));
        },
        get_course_subjects(course) {
            if (Object.keys(university_json).includes(course)) {
                var subjects = Object.keys(university_json[course]).map(y => university_json[course][y]);
                var merged_subjects = ([].concat.apply([], subjects)).filter((item, index, self) => self.indexOf(item) == index);
                return merged_subjects.sort((a, b) => a.localeCompare(b));
            } else {
                return null;
            }
        },
        get_year_course_subjects(course, year) {
            if (Object.keys(university_json).includes(course) && Object.keys(university_json[course]).includes(year)) {
                var subjects = university_json[course][year].filter((item, index, self) => self.indexOf(item) == index);
                return subjects.sort((a, b) => a.localeCompare(b));
            } else {
                return null;
            }
        }
    }
}