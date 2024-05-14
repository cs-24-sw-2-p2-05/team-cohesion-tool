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
