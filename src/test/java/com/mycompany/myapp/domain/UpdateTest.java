package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UpdateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Update.class);
        Update update1 = new Update();
        update1.setId(1L);
        Update update2 = new Update();
        update2.setId(update1.getId());
        assertThat(update1).isEqualTo(update2);
        update2.setId(2L);
        assertThat(update1).isNotEqualTo(update2);
        update1.setId(null);
        assertThat(update1).isNotEqualTo(update2);
    }
}
