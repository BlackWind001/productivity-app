class CurrentDayDataManipulationService {
    constructor () {
        // add current date as a constant
        Object.defineProperty(this, 'currentDate', {
            value: new Date(),
            writable: false,
            enumerable: true,
            configurable: false
        });

        this.shouldWrite = false;
        this.todaysData = { unallocated: {timeSpent: 24} }; // format for storing is activity as key and an object with timeSpent as value

        // TO-DO: Setup a 10 second timer that checks if shouldWrite is true and if yes, writes to the indexedDB
        // TO-DO: Setup a beforeunload event handler that checks if shouldWrite is true and if yes, writes to the indexedDB.
        // QUESTION AND TO-DO: Should I setup an event handler for when it is a new day? Might be an engineering effort.

        // TO-DO: Keep in mind that when updating the database, any unallocated time in the 24 hours needs to be mentioned as such.
    }

    /**
     * This method updates the record of the current data in memory.
     * If an activity is already present in the internal memory, then it is updated.
     * If the activity is not already present then it is created.
     * After successfully updating the data in memory, it sets the shouldWrite flag to true.
     * @param {*} Object: This object contains 2 properties: name of the activity and time spent on the activity.
     */
    updateData ({activity, timeSpent}) {
        try {
            if (!activity || !timeSpent) {
                throw new Error('Activity and time spent are mandatory values')
            }

            if( typeof activity !== 'string' || !activity.match(/^[a-zA-Z0-9_]+$/) ) {
                throw new Error('Activity should be a string with alphanumeric character(s) only')
            }

            if (activity.toLowerCase() === 'unallocated') {
                throw new Error('unallocated is a keyword. You cannot use that as an activity label');
            }

            if (!(typeof timeSpent === 'number')) {
                throw new Error('The time spent should be a number');
            }

            if (timeSpent <= 0 || timeSpent > 24) {
                throw new Error('Time spent on an activity should be a valid value i.e. greater than zero and less than 24.');
            }

            let totalTimeSpent;
            // Check to see if total time spent which is the sum of the time
            // spent on all activities today is less than or equal to 24
            (() => {
                const todayActivities = Object.keys(this.todaysData);

                // remove unallocated time from this calculation
                const unallocatedIndex = todayActivities.indexOf('unallocated');
                (unallocatedIndex !== -1) && todayActivities.splice(unallocatedIndex, 1);

                // calculate the sum of the remaining time spent on activities
                totalTimeSpent = todayActivities.reduce((previousValue, singleActivity) => {
                    // They might be modifying an existing value
                    if (singleActivity === activity) {
                        return previousValue;
                    }
                    return previousValue + this.todaysData[singleActivity].timeSpent;
                }, 0);

                totalTimeSpent += timeSpent;

                if (totalTimeSpent <=0) {
                    throw new Error('Your current entry adds up to a negative total time spent in your day. Please re-enter a valid value.');
                }

                if(totalTimeSpent > 24) {
                    throw new Error('Your current entry exceeds the total time spent to more than 24 hours. Please re-enter a valid value.')
                }
            })();

            // Updating today's data in memory.
            this.todaysData[activity] = { timeSpent: (Math.round(timeSpent*100)/100) };
            this.todaysData['unallocated'] = { timeSpent: (24 - totalTimeSpent) };
            this.shouldWrite = true;

            return Promise.resolve();
        }
        catch (err) {
            // TO-DO: Handle different error cases
            return Promise.reject(err);
        }
    }

    getData (activity) {
        if (activity) {
            return this.todaysData[activity];
        }
        return this.todaysData;
    }

    addToData ({ activity, timeSpent }) {
        try {
            let currentActvityDetails = this.getData(activity);

            if (!currentActvityDetails) {
                throw new Error('Activity is not present in the current data')    
            }

            const currentTimeSpentOnActivity = currentActvityDetails.timeSpent;
            const updatedTimeSpentOnActivity = currentTimeSpentOnActivity + timeSpent;

            this.updateData({activity, updatedTimeSpentOnActivity});

        }
        catch (err) {
            // TO-DO: Handle error case(s)
        }
    }


    writeToDatabase () {
        // This method should write to the indexedDB.
        // Make sure to recalculate the value of the unallocated time property before updating the database.
        // Make sure to set the shouldWrite flag to false once the write operation is completed.
    }
}

export default new CurrentDayDataManipulationService();