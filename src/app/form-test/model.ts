export interface Emp {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    hobbies: Hobby[];
    age: number;
    dept: Dept;
}

export interface Dept {
    id: number;
    name: string;
}
export interface Hobby {
    id: number;
    description: string;
}

export class HobbyBuilder {
    static getHobbies(): Hobby[] {
        return [
            { id: 10, description: 'Aircraft Spotting' },
            { id: 11, description: 'Airsofting' },
            { id: 12, description: 'Animals/pets/dogs' },
            { id: 13, description: 'Basketball' },
            { id: 14, description: 'Compose Music' },
            { id: 15, description: 'Collecting Antiques' },
            { id: 16, description: 'Collecting Sports Cards (Baseball, Football, Basketball, Hockey)' },
            { id: 17, description: 'Gnoming' },
            { id: 18, description: 'Handwriting Analysis' },
            { id: 19, description: 'Home Brewing' }
        ];
    }
    static getThree(): Hobby[] {
        const hobbies = HobbyBuilder.getHobbies();
        const array: number[] = [];
        const result: Hobby[] = [];
        while (array.length < 3) {
            const rnd = Math.floor((Math.random() * 9) + 1);
            if (!array.some(x => x === rnd)) {
                array.push(rnd);
                result.push(hobbies[rnd]);
            }
        }
        return result;
    }
}

export class DeptBuilder {
    private static depts = [
        { id: 1, name: 'Finance' },
        { id: 2, name: 'IT' },
        { id: 3, name: 'Human Resource' },
        { id: 4, name: 'Legal' },
        { id: 5, name: 'Corporate Finance' },
        { id: 6, name: 'Investment Banking' }
    ];
    static build(): Dept[] {
        return DeptBuilder.depts;
    }
    static getDept(id: number): Dept {
        return DeptBuilder.depts.find(x => x.id === id);
    }
}
export class EmployeeBuilder {

    static build(): Emp {
        return {
            id: 1,
            firstName: 'David',
            lastName: 'Shaun',
            gender: 'M',
            age: 35,
            hobbies: HobbyBuilder.getThree(),
            dept: DeptBuilder.getDept(2)
        };
    }
    static save(emp: Emp) {
        console.log(emp);
    }
}