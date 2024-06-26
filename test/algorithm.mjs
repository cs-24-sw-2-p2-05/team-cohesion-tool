'use strict'

import assert from 'node:assert/strict'; // https://nodejs.org/api/assert.html
import { describe, it } from 'node:test'; // https://nodejs.org/api/test.html

import { activitySuggester, timerInterval, consecutiveTime, nextInterval, prevInterval, arrayEquals, uniqueAndSort, activityRanker } from '../src/algorithm.mjs';

const FULL_DAY_OF_TIME_INTERVALS = [
    ["2024-05-13_8_9",   "2024-05-13_9_10" ],
    ["2024-05-13_9_10",  "2024-05-13_10_11"],
    ["2024-05-13_10_11", "2024-05-13_11_12"],
    ["2024-05-13_11_12", "2024-05-13_12_13"],
    ["2024-05-13_12_13", "2024-05-13_13_14"],
    ["2024-05-13_13_14", "2024-05-13_14_15"],
    ["2024-05-13_14_15", "2024-05-13_15_16"],
    ["2024-05-13_15_16", "2024-05-13_16_17"],
    ["2024-05-13_16_17", "2024-05-13_17_18"],
    ["2024-05-13_17_18", "2024-05-13_18_19"],
    ["2024-05-13_18_19", "2024-05-13_19_20"],
    ["2024-05-13_19_20", "2024-05-13_20_21"],
    ["2024-05-13_20_21", "2024-05-13_21_22"],
    ["2024-05-13_21_22", "2024-05-13_22_23"],
];


describe('timerInterval', () => {
    it('should put profile of team under time they can ', () => {
        const team = {
            "name": "Bakkeskolen",
            "profile_ids": ["profile_id1", "profile_id2"],
            "time_frame": {"from" : "2024-05-13", "to" : "2024-05-14"},
        };

        const profiles = {
            "profile_id1": {
                "name": "Sille Smilefjæs",
                "activity_ids": ["activity_id1", "activity_id2", "activity_id3"],
                "time_availability": ["2024-05-13_21_22", "2024-05-13_22_23", "2024-05-14_8_9", "2024-05-14_9_10"],
            },
            "profile_id2": {
                "name": "Sebbie Søvnig",
                "activity_ids": ["activity_id5", "activity_id4", "activity_id2"],
                "time_availability": ["2024-05-13_10_11", "2024-05-13_11_12", "2024-05-14_19_20", "2024-05-14_20_21", "2024-05-15_17_18"],
            },
        };

        const actual_result = timerInterval(team, profiles);
        const expected_result = {
            '2024-05-13_8_9'  : [],
            '2024-05-13_9_10' : [],
            '2024-05-13_10_11': ['profile_id2'],
            '2024-05-13_11_12': ['profile_id2'],
            '2024-05-13_12_13': [],
            '2024-05-13_13_14': [],
            '2024-05-13_14_15': [],
            '2024-05-13_15_16': [],
            '2024-05-13_16_17': [],
            '2024-05-13_17_18': [],
            '2024-05-13_18_19': [],
            '2024-05-13_19_20': [],
            '2024-05-13_20_21': [],
            '2024-05-13_21_22': ['profile_id1'],
            '2024-05-13_22_23': ['profile_id1'],
            '2024-05-14_8_9'  : ['profile_id1'],
            '2024-05-14_9_10' : ['profile_id1'],
            '2024-05-14_10_11': [],
            '2024-05-14_11_12': [],
            '2024-05-14_12_13': [],
            '2024-05-14_13_14': [],
            '2024-05-14_14_15': [],
            '2024-05-14_15_16': [],
            '2024-05-14_16_17': [],
            '2024-05-14_17_18': [],
            '2024-05-14_18_19': [],
            '2024-05-14_19_20': ['profile_id2'],
            '2024-05-14_20_21': ['profile_id2'],
            '2024-05-14_21_22': [],
            '2024-05-14_22_23': [],
        };
        assert.deepStrictEqual(actual_result, expected_result);
    });
});

describe('nextInterval', () => {
    it('should iterate through a full day', () => {
        FULL_DAY_OF_TIME_INTERVALS.forEach(([before, after]) => {
            assert.strictEqual(nextInterval(before), after);
        });
    });
    it('should change cleanly to the next day', () => {
        assert.strictEqual(nextInterval("2024-05-13_22_23"), "2024-05-14_8_9");
        assert.strictEqual(nextInterval("2024-04-30_22_23"), "2024-05-01_8_9");
        assert.strictEqual(nextInterval("2023-12-31_22_23"), "2024-01-01_8_9");
    });
});

describe('prevInterval', () => {
    it('should iterate through a full day', () => {
        FULL_DAY_OF_TIME_INTERVALS.forEach(([before, after]) => {
            assert.strictEqual(prevInterval(after), before);
        });
    });
    it('should change cleanly to the previous day', () => {
        assert.strictEqual(prevInterval("2024-05-14_8_9"), "2024-05-13_22_23");
        assert.strictEqual(prevInterval("2024-05-01_8_9"), "2024-04-30_22_23");
        assert.strictEqual(prevInterval("2024-01-01_8_9"), "2023-12-31_22_23");
    });
});

describe('consecutiveTime', () => {
    it('should only include the timespans where at least half the members are available', () => {
        const time_intervals = {
            '2024-05-13_8_9'  : [],
            '2024-05-13_9_10' : [],
            '2024-05-13_10_11': [],
            '2024-05-13_11_12': ['profile_id2'],
            '2024-05-13_12_13': ['profile_id2'],
            '2024-05-13_13_14': ['profile_id2'],
            '2024-05-13_14_15': ['profile_id2'],
            '2024-05-13_15_16': [],
            '2024-05-13_16_17': [],
            '2024-05-13_17_18': [],
            '2024-05-13_18_19': [],
            '2024-05-13_19_20': [],
            '2024-05-13_20_21': ['profile_id1'],
            '2024-05-13_21_22': ['profile_id1', 'profile_id4'],
            '2024-05-13_22_23': ['profile_id1', 'profile_id4'],
            '2024-05-14_8_9'  : ['profile_id1', 'profile_id4'],
            '2024-05-14_9_10' : ['profile_id1', 'profile_id4'],
            '2024-05-14_10_11': ['profile_id4'],
            '2024-05-14_11_12': [],
            '2024-05-14_12_13': [],
            '2024-05-14_13_14': [],
            '2024-05-14_14_15': [],
            '2024-05-14_15_16': [],
            '2024-05-14_16_17': [],
            '2024-05-14_17_18': [],
            '2024-05-14_18_19': [],
            '2024-05-14_19_20': ['profile_id4'],
            '2024-05-14_20_21': [],
            '2024-05-14_21_22': [],
            '2024-05-14_22_23': [],
        };

        const team = {
            "name": "Bakkeskolen",
            "profile_ids": ["profile_id1", "profile_id2", "profile_id3", "profile_id4"],
            "time_frame": {"from" : "2024-05-13", "to" : "2024-05-15"},
        };

        const actual_result = consecutiveTime(time_intervals, team);
        const expected_result = {
            '2024-05-13_21_22': {
                users: ['profile_id1', 'profile_id4'],
                interval_list: ['2024-05-13_21_22', '2024-05-13_22_23'],
            },
            '2024-05-13_22_23': {
                users: ['profile_id1', 'profile_id4'],
                interval_list: ['2024-05-13_21_22', '2024-05-13_22_23'],
            },
            '2024-05-14_8_9': {
                users: ['profile_id1', 'profile_id4'],
                interval_list: ['2024-05-14_8_9', '2024-05-14_9_10'],
            },
            '2024-05-14_9_10': {
                users: ['profile_id1', 'profile_id4'],
                interval_list: ['2024-05-14_8_9', '2024-05-14_9_10'],
            },
        };

        assert.deepStrictEqual(actual_result, expected_result);
    });
});

describe('arrayEquals', () => {
    it('equal arrays should return true', () => {
        const array_one = ["string", 4.2, 100, true];
        const array_two = [100, 4.2, true, "string"];

        const actual_result = arrayEquals(array_one, array_two);
        const expected_result = true;

        assert.deepStrictEqual(actual_result, expected_result);
    });
    it('unequal arrays should return false', () => {
        const array_one = ["string", 4.2, 100, true];
        const array_two = [100, 4.2, true, "string", "oops!"];

        const actual_result = arrayEquals(array_one, array_two);
        const expected_result = false;

        assert.deepStrictEqual(actual_result, expected_result);
    });
});

describe('uniqueAndSort', () => {
    it('should deduplicate objects', () => {
        const consecutive_times = {
          '14/05/2024_8_9': {
            users: [ 'profile_id1', 'profile_id4' ],
            interval_list: [ '14/05/2024_8_9', '14/05/2024_9_10', '14/05/2024_10_11' ]
          },
          '14/05/2024_9_10': {
            users: [ 'profile_id1', 'profile_id4' ],
            interval_list: [ '14/05/2024_8_9', '14/05/2024_9_10', '14/05/2024_10_11' ]
          }
        };

        const actual_result = uniqueAndSort(consecutive_times);
        const expected_result = [{
            users: [ 'profile_id1', 'profile_id4' ],
            interval_list: [ '14/05/2024_8_9', '14/05/2024_9_10', '14/05/2024_10_11' ]
        }];

        assert.deepStrictEqual(actual_result, expected_result);
    });
});


describe('activityRanker', () => {
  it('should rank the activities', () => {
      // PREPARE
      const list_consecutive_times = [{
        users: [ 'profile_id1', 'profile_id4' ],
        interval_list: [ '14/05/2024_8_9', '14/05/2024_9_10', '14/05/2024_10_11' ]
    }];

      const profiles = {
        "profile_id1": {
            "name": "Sille Smilefjæs",
            "activity_ids": [
                "activity_id1",
                "activity_id2",
                "activity_id3"
            ],
            "time_availability": [
                "2024-05-13_21_22",
                "2024-05-13_22_23",
                "2024-05-14_8_9",
                "2024-05-14_9_10"
            ]
        },
        "profile_id4": {
            "name": "Daaaan Dandan",
            "activity_ids": [
                "activity_id1",
                "activity_id3",
                "activity_id5"
            ],
            "time_availability": [
                "2024-05-14_8_9",
                "2024-05-14_9_10",
                "2024-05-14_18_19",
                "2024-05-14_19_20",
                "2024-05-14_20_21",
                "2024-05-15_18_19",
                "2024-05-15_21_22",
                "2024-05-15_22_23"
            ]
        }
      };

      const activities = {
        "activity_id1": {
            "name": "League of Legends",
            "description": "Kinda like roleplaying in the dark forest",
            "main_interest_id": "interest_id1",
            "all_interest_ids": [
                "interest_id1"
            ],
            "time_interval": "1"
        },
        "activity_id2": {
            "name": "World of Warcraft",
            "description": "Kinda like roleplaying for people who like to grind",
            "main_interest_id": "interest_id1",
            "all_interest_ids": [
                "interest_id1"
            ],
            "time_interval": "2"
        },
        "activity_id3": {
            "name": "Counter Strike 2",
            "description": "Shooty shooty bang bang",
            "main_interest_id": "interest_id1",
            "all_interest_ids": [
                "interest_id1"
            ],
            "time_interval": "1"
        },
        "activity_id5": {
            "name": "Visual Arts",
            "description": "Such as drawing and painting stuff",
            "main_interest_id": "interest_id2",
            "all_interest_ids": [
                "interest_id2"
            ],
            "time_interval": "2"
        }
      };

      // DO
      const actual_result = activityRanker(list_consecutive_times, profiles, activities);
      const expected_result = [
        {
            users: [
                "profile_id1",
                "profile_id4"
            ],
            interval_list: [ '14/05/2024_8_9', '14/05/2024_9_10', '14/05/2024_10_11' ],
            scored_activities: [ {
                "activity_id1": 2
            },
            {
                "activity_id3": 2

            }, 
            {
                "activity_id2": 1.5

            },
            {
                "activity_id5": 1
            } ]
        }];

      // CHECK
      assert.deepStrictEqual(actual_result, expected_result);
  });
});

