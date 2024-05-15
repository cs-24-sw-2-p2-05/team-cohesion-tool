'use strict'

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { activitySuggester, timerInterval, consecutiveTime, uniqueAndSort } from '../src/algorithm.mjs';

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
    it('should sort missorted elements', { todo: true }, () => {});
});


describe('timerInterval', () => {
  it('should put profile of team under time they can ', { todo: true }, () => {
      // PREPARE
      const team = {
        "name": "Bakkeskolen",
        "profile_ids": ["profile_id1"],
        "time_frame": {"from" : "2024-05-13", "to" : "2024-05-14"}};

      const profiles = {"profile_id1": {
        "name": "Sille Smilefjæs",
        "activity_ids": ["activity_id1", "activity_id2", "activity_id3"],
        "time_availability": ["2024-05-13_21_22", "2024-05-13_22_23", "2024-05-14_8_9", "2024-05-14_9_10"]
    }}

      // DO
      const actual_result = timerInterval(team, profiles);
      const expected_result = {
      '2024-05-13_8_9': [],
      '2024-05-13_9_10': [],
      '2024-05-13_10_11': [],
      '2024-05-13_11_12': [],
      '2024-05-13_12_13': [],
      '2024-05-13_13_14': [],
      '2024-05-13_14_15': [],
      '2024-05-13_15_16': [],
      '2024-05-13_16_17': [],
      '2024-05-13_17_18': [],
      '2024-05-13_18_19': [],
      '2024-05-13_19_20': [],
      '2024-05-13_20_21': [],
      '2024-05-13_21_22': [ 'profile_id1' ],
      '2024-05-13_22_23': [ 'profile_id1' ],
      '2024-05-14_8_9': [ 'profile_id1' ],
      '2024-05-14_9_10': [ 'profile_id1' ],
      '2024-05-14_10_11': [],
      '2024-05-14_11_12': [],
      '2024-05-14_12_13': [],
      '2024-05-14_13_14': [],
      '2024-05-14_14_15': [],
      '2024-05-14_15_16': [],
      '2024-05-14_16_17': [],
      '2024-05-14_17_18': [],
      '2024-05-14_18_19': [],
      '2024-05-14_19_20': [],
      '2024-05-14_20_21': [],
      '2024-05-14_21_22': [],
      '2024-05-14_22_23': [],
    };

      // CHECK
      assert.deepStrictEqual(actual_result, expected_result);; 
    });
  });
