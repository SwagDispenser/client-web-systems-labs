interface Course {
    name: string;
    duration: number;
    students: string[];
}

class OnlineCourse implements Course {
    constructor(public name: string, public duration: number, public students: string[] = []) {}

    registerStudent(studentName: string): void {
        if (!this.isStudentRegistered(studentName)) {
            this.students.push(studentName);
            console.log(studentName, "registered for", this.name);
        } else {
            console.log(studentName, "already registered for", this.name);
        }
    }

    isStudentRegistered(studentName: string): boolean {
        return this.students.includes(studentName);
    }
}

class CourseManager {
    private courses: Course[] = [];

    addCourse(course: Course): void {
        this.courses.push(course);
        console.log(course, "added");
    }

    removeCourse(courseName: string): void {
        const index: number = this.courses.findIndex((course: Course) => course.name === courseName);

        if (index !== -1) {
            this.courses.splice(index, 1);
            console.log(courseName, "removed");
        } else {
            console.log(courseName, "not found");
        }
    }

    findCourse(courseName: string): Course | undefined {
        return this.courses.find((course: Course) => course.name === courseName);
    }

    showCourses(): void {
        console.log("Showing Courses");

        for (const course of this.courses) {
            console.log(course.name, "duration:", course.duration);
        }
    }
}

const mathCourse: OnlineCourse = new OnlineCourse("Math", 90);
const webCourse: OnlineCourse = new OnlineCourse("Web Course", 120);

mathCourse.registerStudent("IvanBossauto");
mathCourse.registerStudent("Evgen");
mathCourse.registerStudent("Lona");

webCourse.registerStudent("Dima");
webCourse.registerStudent("Jane");
webCourse.registerStudent("February");

console.log("Is Lona registered:", mathCourse.isStudentRegistered("Lona"));

console.log("Is IvanBossauto registered:", mathCourse.isStudentRegistered("IvanBossauto"));

const courseManager: CourseManager = new CourseManager();

courseManager.addCourse(mathCourse);
courseManager.addCourse(webCourse);

courseManager.showCourses();

const foundCourses: Course | undefined = courseManager.findCourse("Web Course");

if (foundCourses !== undefined) {
    console.log("Found Course ", foundCourses.name);
    console.log("Registered students ", foundCourses.students.join(", "));

    courseManager.removeCourse("Web Course");

    courseManager.showCourses();
}



