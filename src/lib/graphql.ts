import { gql } from "@apollo/client";
import { apolloClient } from "./apollo";

const DELETE_ISSUE = gql`
  mutation DeleteIssue($issueId: ID!) {
    deleteIssue(input: { issueId: $issueId }) {
      clientMutationId
    }
  }
`;

export async function deleteIssueGraphQL(nodeId: string) {
  return apolloClient.mutate({
    mutation: DELETE_ISSUE,
    variables: {
      issueId: nodeId,
    },
  });
}