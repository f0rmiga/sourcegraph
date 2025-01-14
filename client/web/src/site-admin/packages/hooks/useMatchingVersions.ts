import { ApolloError } from '@apollo/client'

import { useQuery } from '@sourcegraph/http-client'

import {
    PackageRepoReferencesMatchingFilterResult,
    PackageRepoReferencesMatchingFilterVariables,
} from '../../../graphql-operations'
import { packageRepoFilterQuery } from '../backend'

interface UseMatchingVersionsResult {
    versions: string[]
    totalCount: number
    loading: boolean
    error: ApolloError | undefined
}

export const useMatchingVersions = (
    variables: PackageRepoReferencesMatchingFilterVariables
): UseMatchingVersionsResult => {
    const { data, loading, error } = useQuery<
        PackageRepoReferencesMatchingFilterResult,
        PackageRepoReferencesMatchingFilterVariables
    >(packageRepoFilterQuery, {
        variables,
    })

    const { versions, totalCount } =
        data?.packageRepoReferencesMatchingFilter.__typename === 'PackageRepoReferenceVersionConnection'
            ? {
                  versions: data.packageRepoReferencesMatchingFilter.nodes.map(node => node.version),
                  totalCount: data.packageRepoReferencesMatchingFilter.totalCount,
              }
            : {
                  versions: [],
                  totalCount: 0,
              }

    return {
        versions,
        totalCount,
        loading,
        error,
    }
}
