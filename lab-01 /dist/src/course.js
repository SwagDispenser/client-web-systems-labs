"use strict";
class OnlineCourse {
    constructor(name, duration, students = []) {
        this.name = name;
        this.duration = duration;
        this.students = students;
    }
    registerStudent(studentName) {
        if (!this.isStudentRegistered(studentName)) {
            this.students.push(studentName);
            console.log(studentName, "registered for", this.name);
        }
        else {
            console.log(studentName, "already registered for", this.name);
        }
    }
    isStudentRegistered(studentName) {
        return this.students.includes(studentName);
    }
}
class CourseManager {
    constructor() {
        this.courses = [];
    }
    addCourse(course) {
        this.courses.push(course);
        console.log(course, "added");
    }
    removeCourse(courseName) {
        const index = this.courses.findIndex((course) => course.name === courseName);
        if (index !== -1) {
            this.courses.splice(index, 1);
            console.log(courseName, "removed");
        }
        else {
            console.log(courseName, "not found");
        }
    }
    findCourse(courseName) {
        return this.courses.find((course) => course.name === courseName);
    }
    showCourses() {
        console.log("Showing Courses");
        for (const course of this.courses) {
            console.log(course.name, "duration:", course.duration);
        }
    }
}
const mathCourse = new OnlineCourse("Math", 90);
const webCourse = new OnlineCourse("Web Course", 120);
mathCourse.registerStudent("IvanBossauto");
mathCourse.registerStudent("Evgen");
mathCourse.registerStudent("Lona");
webCourse.registerStudent("Dima");
webCourse.registerStudent("Jane");
webCourse.registerStudent("February");
console.log("Is Lona registered:", mathCourse.isStudentRegistered("Lona"));
console.log("Is IvanBossauto registered:", mathCourse.isStudentRegistered("IvanBossauto"));
const courseManager = new CourseManager();
courseManager.addCourse(mathCourse);
courseManager.addCourse(webCourse);
courseManager.showCourses();
const foundCourses = courseManager.findCourse("Web Course");
if (foundCourses !== undefined) {
    console.log("Found Course ", foundCourses.name);
    console.log("Registered students ", foundCourses.students.join(", "));
    courseManager.removeCourse("Web Course");
    courseManager.showCourses();
}
