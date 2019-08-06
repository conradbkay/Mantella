"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("./../../../../client/src/graphql/queries");
const testUtils_1 = require("../../testUtils");
const queries_2 = require("../../../../client/src/graphql/queries");
describe('GQL Queries', () => {
    test('Projects and projectById', async () => {
        const { data: projectData } = await testUtils_1.gqlReq({
            isMutation: false,
            query: queries_2.GQL_GET_PROJECT,
            variables: {
                id: '5d08fbce79d3d5773e47fd90'
            }
        });
        expect(projectData.projectById.id).toBe('5d08fbce79d3d5773e47fd90');
        expect(projectData.projectById).toMatchSnapshot();
        // ids: ['5d08fbce79d3d5773e47fd90', '5d08fbd9c53c0477859eeb56']
    });
    test('Gets user', async () => {
        const { data: userData } = await testUtils_1.gqlReq({
            isMutation: false,
            query: queries_1.GQL_GET_USER,
            variables: {
                id: '5d04064a9b99a535a2a28950'
            }
        });
        expect(userData.user).toBeTruthy();
        expect(userData.user.id).toBe('5d04064a9b99a535a2a28950');
    });
});
//# sourceMappingURL=queries.test.js.map