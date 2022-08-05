package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VersionApplicableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VersionApplicable.class);
        VersionApplicable versionApplicable1 = new VersionApplicable();
        versionApplicable1.setId(1L);
        VersionApplicable versionApplicable2 = new VersionApplicable();
        versionApplicable2.setId(versionApplicable1.getId());
        assertThat(versionApplicable1).isEqualTo(versionApplicable2);
        versionApplicable2.setId(2L);
        assertThat(versionApplicable1).isNotEqualTo(versionApplicable2);
        versionApplicable1.setId(null);
        assertThat(versionApplicable1).isNotEqualTo(versionApplicable2);
    }
}
