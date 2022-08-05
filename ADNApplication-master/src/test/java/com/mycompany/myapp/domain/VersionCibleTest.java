package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VersionCibleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VersionCible.class);
        VersionCible versionCible1 = new VersionCible();
        versionCible1.setId(1L);
        VersionCible versionCible2 = new VersionCible();
        versionCible2.setId(versionCible1.getId());
        assertThat(versionCible1).isEqualTo(versionCible2);
        versionCible2.setId(2L);
        assertThat(versionCible1).isNotEqualTo(versionCible2);
        versionCible1.setId(null);
        assertThat(versionCible1).isNotEqualTo(versionCible2);
    }
}
