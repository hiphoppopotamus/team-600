import "vue-jest"
import api from '../Api'
import {shallowMount, createLocalVue} from "@vue/test-utils";
import router from "../index";

import ActivitySearch from "../views/Search/ActivitySearch";
import "jest";
import BootstrapVue from "bootstrap-vue";
import {gmapApi} from "gmap-vue";

jest.mock('../Api');
jest.mock("gmap-vue");

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(gmapApi);

const ACTIVITY_TYPES = [
    "Biking", "Hiking", "Athletics"
];

let pageSize = 5;

const userData = {
    "private_location": {
        "name": "private_location",
        "lng": 10.0,
        "lat": 10.0,
    },
    "public_location": {
        "name": "public_location",
        "lng": 15.0,
        "lat": 15.0,
    }
};

const SEARCH_RESPONSE1 = [
    {
        "firstname": "DJ",
        "lastname": "Roomba",
        "activity_name": "PLACEHOLDER",
        "activityTypes": [
            {
                "activityTypeId": 12,
                "name": "Biking"
            },
            {
                "activityTypeId": 34,
                "name": "Hiking"
            }
        ]
    },
    {
        "firstname": "Akira",
        "lastname": "Kurosawa",
        "activityName": "PLACEHOLDERS",
        "activityTypes": [
            {
                "activityTypeId": 12,
                "name": "Biking"
            },
            {
                "activityTypeId": 34,
                "name": "Hiking"
            }
        ]
    },
    {
        "firstname": "Samantha",
        "lastname": "Saliva",
        "activity_name": "lmao",
        "activityTypes": [
            {
                "activityTypeId": 7,
                "name": "Athletics"
            },
            {
                "activityTypeId": 34,
                "name": "Hiking"
            }
        ]
    },
    {
        "firstname": "Manny",
        "lastname": "Mannamynamo",
        "activity_name": "idk",
        "activityTypes": [
            {
                "activityTypeId": 12,
                "name": "Biking"
            }
        ]
    },
    {
        "firstname": "Jenny",
        "lastname": "Mariam",
        "activity_name": "Another",
        "activityTypes": [
            {
                "activityTypeId": 12,
                "name": "Biking"
            }
        ]
    },
    {
        "firstname": "Mary",
        "lastname": "Sidoarjo",
        "activity_name": "Another Another Kaikoura Coast Track race",
        "activityTypes": [
            {
                "activityTypeId": 34,
                "name": "Hiking"
            }
        ]
    }
];

let activitySearch;

beforeEach(() => {
    api.getActivityTypes.mockImplementation(() =>
        Promise.resolve({
            data: ACTIVITY_TYPES,
            status: 200
        })
    );

    api.getAllUserData.mockImplementation(() => Promise.resolve({data: userData, status: 200}))
    api.getUserId.mockImplementation(() => Promise.resolve({status: 200}));

    api.logout.mockImplementation(() => Promise.resolve({status:200}));

    activitySearch = shallowMount(ActivitySearch, {
        router,
        mocks: {api},
        localVue
    });
});


describe("Search for activities by keywords", () => {

    test("Search user with activity keyword 'PLACEHOLDER'", () => {

            api.getActivityByActivityTitle.mockImplementation(() =>
                Promise.resolve({
                    data: SEARCH_RESPONSE1.slice((activitySearch.vm.$data.currentPage  - 1) * pageSize, activitySearch.vm.$data.currentPage  * pageSize),
                    status: 200,
                    headers: {
                        "total-rows": SEARCH_RESPONSE1.length
                    }
                })
            );

            activitySearch.setData({
                activityTitle: ["PLACEHOLDER"],
                minFitnessLevel: -1,
                maxFitnessLevel: 4
            });

            return activitySearch.vm.getPaginatedActivitiesByActivityTitle().then(() => {
                expect(activitySearch.vm.api.getActivityByActivityTitle).toHaveBeenCalledWith(["PLACEHOLDER"], -1, 4, activitySearch.vm.$data.currentPage - 1);
            });
        });

    describe("With the '+' method", () => {

        test("Search activity with two activity keywords 'PLACEHOLDER' and 'PLACEHOLDERS'", () => {

            api.getActivityByActivityTitle.mockImplementation(() =>
                Promise.resolve({
                    data: SEARCH_RESPONSE1.slice((activitySearch.vm.$data.currentPage - 1) * pageSize, activitySearch.vm.$data.currentPage * pageSize),
                    status: 200,
                    headers: {
                        "total-rows": SEARCH_RESPONSE1.length
                    }
                })
            );

            activitySearch.setData({
                activityTitle: ["PLACEHOLDER + PLACEHOLDERS"],
                minFitnessLevel: -1,
                maxFitnessLevel: 4
            });

            return activitySearch.vm.getPaginatedActivitiesByActivityTitle().then(() => {
                expect(activitySearch.vm.api.getActivityByActivityTitle).toHaveBeenCalledWith(["PLACEHOLDER + PLACEHOLDERS"], -1, 4, activitySearch.vm.$data.currentPage - 1);
            });
        });
    });

    describe("With the '-' method", () => {

        test("Search activity with two activity keywords 'PLACEHOLDER' excluding 'PLACEHOLDERS'", () => {

            api.getActivityByActivityTitle.mockImplementation(() =>
                Promise.resolve({
                    data: SEARCH_RESPONSE1.slice((activitySearch.vm.$data.currentPage - 1) * pageSize, activitySearch.vm.$data.currentPage * pageSize),
                    status: 200,
                    headers: {
                        "total-rows": SEARCH_RESPONSE1.length
                    }
                })
            );

            activitySearch.setData({
                activityTitle: ["PLACEHOLDER - PLACEHOLDERS"],
                minFitnessLevel: -1,
                maxFitnessLevel: 4
            });

            return activitySearch.vm.getPaginatedActivitiesByActivityTitle().then(() => {
                expect(activitySearch.vm.api.getActivityByActivityTitle).toHaveBeenCalledWith(["PLACEHOLDER - PLACEHOLDERS"], -1, 4, activitySearch.vm.$data.currentPage - 1);
            });
        });
    });

    describe('With the "string" method', () => {

        test('Search activity with exact activity keyword "PLACEHOLDER"', () => {

            api.getActivityByActivityTitle.mockImplementation(() =>
                Promise.resolve({
                    data: SEARCH_RESPONSE1.slice((activitySearch.vm.$data.currentPage - 1) * pageSize, activitySearch.vm.$data.currentPage * pageSize),
                    status: 200,
                    headers: {
                        "total-rows": SEARCH_RESPONSE1.length
                    }
                })
            );

            activitySearch.setData({
                activityTitle: ['"PLACEHOLDER"'],
                minFitnesslevel: -1,
                maxFitnessLevel: 4
            });

            return activitySearch.vm.getPaginatedActivitiesByActivityTitle().then(() => {
                expect(activitySearch.vm.api.getActivityByActivityTitle).toHaveBeenCalledWith(['"PLACEHOLDER"'], -1, 4, activitySearch.vm.$data.currentPage - 1);
            });
        });
    });

});


test('Is a vue instance', () => {
    expect(activitySearch.isVueInstance).toBeTruthy();
});

test('Activity type search box exists', () => {
    expect(activitySearch.find('#searchBoxActivities').exists()).toBeTruthy();
});

test('Search button exists', () => {
    expect(activitySearch.find('#searchButton').exists()).toBeTruthy();
});

describe("Search for activities by activity type", () => {

    test("Search activity with activity type 'Archery','Climbing'", () => {

        api.getActivityByActivityType.mockImplementation(() =>
            Promise.resolve({
                data: SEARCH_RESPONSE1.slice((activitySearch.vm.$data.currentPage - 1) * pageSize, activitySearch.vm.$data.currentPage * pageSize),
                status: 200,
                headers: {
                    "total-rows": SEARCH_RESPONSE1.length
                }
            })
        );

        activitySearch.setData({
            activityTypesSearchedFor: ["Archery","Climbing"],
            minFitnessLevel: -1,
            maxFitnessLevel: 4
        });

        return activitySearch.vm.getPaginatedActivitiesByActivityType().then(() => {
            expect(activitySearch.vm.api.getActivityByActivityType).toHaveBeenCalledWith(["Archery","Climbing"],"and", -1, 4, activitySearch.vm.$data.currentPage - 1);
        });
    });
});

describe("Filter search", () => {
    test("Filter search button exists when the clear filters button doesn't", () => {
        expect(activitySearch.find('#filterSearchButton').exists()).toBeTruthy();
        expect(activitySearch.find('#clearFiltersButton').exists()).toBeFalsy();
    });

    test("Clear filters button exists when filter search button doesn't", () => {
        activitySearch = shallowMount(ActivitySearch, {
            router,
            mocks: {api},
            localVue,
            data() {
                return {
                    filterSearch: true
                }
            }
        });
        expect(activitySearch.find('#clearFiltersButton').exists()).toBeTruthy();
        expect(activitySearch.find('#filterSearchButton').exists()).toBeFalsy();
    });

    test("When the user can filter, they should be able to access the clearFiltersButton, minimumFitnessLevel and maximumFitnessLevel", () => {
        activitySearch = shallowMount(ActivitySearch, {
            router,
            mocks: {api},
            localVue,
            data() {
                return {
                    filterSearch: true
                }
            }
        });
        expect(activitySearch.find('#clearFiltersButton').exists()).toBeTruthy();
        expect(activitySearch.find('#minimumFitnessLevel').exists()).toBeTruthy();
        expect(activitySearch.find('#maximumFitnessLevel').exists()).toBeTruthy();
    });

    test("When the user can filter, they should be able to access the checkbox for including unleveled activities", () => {
        activitySearch = shallowMount(ActivitySearch, {
            router,
            mocks: {api},
            localVue,
            data() {
                return {
                    filterSearch: true
                }
            }
        });
        expect(activitySearch.find('#clearFiltersButton').exists()).toBeTruthy();
        expect(activitySearch.find('#includeUnleveledBox').exists()).toBeTruthy();
    })
});

test('map pane does not exist at default', () => {
    expect(activitySearch.find('#mapComponent').exists()).toBeFalsy();
});

test('gmap Auto complete does not exist at default', () => {
    expect(activitySearch.find('#gmapAutoComplete').exists()).toBeFalsy();
});

test('Add marker button does not exist at default', () => {
    expect(activitySearch.find('#addMarkerButton').exists()).toBeFalsy();
});

test('Pins are empty by default', () => {
    api.getAllUserData.mockImplementation(() => Promise.resolve({data: userData, status:200}));
    activitySearch = shallowMount(ActivitySearch, {localVue, mocks: {api}});
    expect(activitySearch.vm.$data.pins).toHaveLength(0);
});

test('Map center is undefined by default', () => {
    api.getAllUserData.mockImplementation(() => Promise.resolve({data: userData, status:200}));
    activitySearch = shallowMount(ActivitySearch, {localVue, mocks: {api}});
    expect(activitySearch.vm.$data.currentLocation.lat).toBeUndefined();
    expect(activitySearch.vm.$data.currentLocation.lng).toBeUndefined();
});