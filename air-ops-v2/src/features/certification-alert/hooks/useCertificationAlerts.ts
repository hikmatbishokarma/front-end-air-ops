import { useState, useEffect } from "react";
import { useSession } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { GET_STAFF_CERTIFICATION } from "@/lib/graphql/queries/crew-detail";

interface CertificationAlert {
    id: string;
    title: string;
    staffName: string;
    daysLeft: number;
    validTill: string;
}

export const useStaffCertifications = () => {
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const { session } = useSession();
    const operatorId = session?.user?.operator?.id || null;

    useEffect(() => {
        const fetchCertifications = async () => {
            // if (!operatorId) {
            //     console.log("No operatorId found, skipping certification fetch");
            //     return;
            // }



            const date = new Date();
            date.setMonth(date.getMonth() + 3);

            const validTillBefore = date.toISOString();

            setLoading(true);
            setError(null);

            try {
                const result = await useGql({
                    query: GET_STAFF_CERTIFICATION,
                    queryName: "staffCertificates",
                    queryType: "query-without-edge",
                    variables: {
                        args: {
                            where: {
                                ...(operatorId && { operatorId }),
                                validTillBefore
                            },
                        },
                    },
                });

                console.log("API Response:", result);

                // The API returns { data: [...], totalCount: number }
                // So we need to access result.data or result directly
                const certData = result?.data || result || [];
                console.log("Certification data:", certData);

                setCertifications(certData);
            } catch (err) {
                console.error("Error fetching staff certifications:", err);
                setError(err);
                setCertifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, [operatorId]);

    return { certifications, loading, error };
};

export const useCertificationAlerts = (certificationList: any[]): CertificationAlert[] => {
    const today = new Date();

    return certificationList.map((item) => {
        const validTill = new Date(item.validTill);
        const diffTime = validTill.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            id: item.id,
            title: `${item.name} (${item.licenceNo})`,
            staffName: item.displayName ?? item.staffName,
            daysLeft,
            validTill: item.validTill,
        };
    });
};
